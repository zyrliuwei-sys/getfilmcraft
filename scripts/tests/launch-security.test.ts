import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createClient } from '@libsql/client';

import { safeInternalPath } from '../../src/lib/redirect';
import { isCrossOriginMutation } from '../../src/lib/request-security';
import { respData, respErr } from '../../src/lib/resp';

// This suite uses an isolated SQLite database and never changes remote D1.
const directory = mkdtempSync(join(tmpdir(), 'filmcraft-security-'));
process.env.DATABASE_PROVIDER = 'sqlite';
process.env.DATABASE_URL = `file:${join(directory, 'security.sqlite')}`;
process.env.DB_SINGLETON_ENABLED = 'true';

await test('redirects reject browser-normalized external targets and auth loops', () => {
  for (const url of [
    '//evil.example',
    '/\\evil.example',
    '/\n/evil.example',
    'javascript:alert(1)',
    '/zh/sign-in?callbackUrl=/settings',
  ]) {
    assert.equal(safeInternalPath(url), null, url);
  }
  assert.equal(
    safeInternalPath('/settings/profile?tab=account'),
    '/settings/profile?tab=account'
  );
});

await test('API mutations reject hostile origins but allow signed webhooks', () => {
  const make = (path: string, headers: Record<string, string>) =>
    new Request(`https://getfilmcraft.org${path}`, { method: 'POST', headers });
  assert.equal(
    isCrossOriginMutation(
      make('/api/user/profile', { origin: 'https://evil.example' })
    ),
    true
  );
  assert.equal(
    isCrossOriginMutation(make('/zh/api/admin/config', { origin: 'null' })),
    true
  );
  assert.equal(
    isCrossOriginMutation(
      make('/api/admin/config', { 'sec-fetch-site': 'cross-site' })
    ),
    true
  );
  assert.equal(
    isCrossOriginMutation(
      make('/api/user/profile', { origin: 'https://getfilmcraft.org' })
    ),
    false
  );
  assert.equal(
    isCrossOriginMutation(make('/api/payment/notify/stripe', {})),
    false
  );
});

await test('API responses are not cacheable and infrastructure errors stay private', async () => {
  assert.equal(
    respData({ key: 'test-only' }).headers.get('cache-control'),
    'no-store'
  );
  assert.equal(respErr('Unauthorized').status, 401);
  assert.equal(respErr('Forbidden').status, 403);
  const response = await respErr(
    'Failed query: SELECT secret FROM config; params: private'
  ).json();
  assert.equal(response.message, 'Internal error');
});

await test('disabled and expired roles do not retain permissions', async () => {
  const client = createClient({ url: process.env.DATABASE_URL! });
  await client.executeMultiple(`
    CREATE TABLE role (id TEXT PRIMARY KEY, name TEXT, status TEXT);
    CREATE TABLE user_role (id TEXT PRIMARY KEY, user_id TEXT, role_id TEXT, expires_at INTEGER);
    CREATE TABLE permission (id TEXT PRIMARY KEY, code TEXT);
    CREATE TABLE role_permission (id TEXT PRIMARY KEY, role_id TEXT, permission_id TEXT);
    INSERT INTO role VALUES ('r-active','admin','active'),('r-disabled','old-admin','inactive'),('r-expired','expired-admin','active');
    INSERT INTO permission VALUES ('p1','admin.access'),('p2','*');
    INSERT INTO role_permission VALUES ('rp1','r-active','p1'),('rp2','r-disabled','p2'),('rp3','r-expired','p2');
    INSERT INTO user_role VALUES ('ur1','user-active','r-active',NULL),('ur2','user-disabled','r-disabled',NULL),('ur3','user-expired','r-expired',1);
  `);
  const { hasPermission } = await import('../../src/modules/rbac/service');
  assert.equal(await hasPermission('user-active', 'admin.access'), true);
  assert.equal(await hasPermission('user-disabled', '*'), false);
  assert.equal(await hasPermission('user-expired', '*'), false);
  client.close();
});

await test('credit refunds are idempotent and amounts are validated', async () => {
  const client = createClient({ url: process.env.DATABASE_URL! });
  await client.executeMultiple(`
    CREATE TABLE credit (
      id TEXT PRIMARY KEY, user_id TEXT, user_email TEXT, order_no TEXT,
      subscription_no TEXT, transaction_no TEXT, transaction_type TEXT,
      transaction_scene TEXT, credits INTEGER, remaining_credits INTEGER,
      description TEXT, expires_at INTEGER, status TEXT, created_at INTEGER,
      updated_at INTEGER, deleted_at INTEGER, consumed_detail TEXT, metadata TEXT
    );
    INSERT INTO credit (id,user_id,transaction_no,transaction_type,credits,remaining_credits,status)
      VALUES ('grant','test-user','grant-tx','grant',100,60,'active');
  `);
  await client.execute({
    sql: `INSERT INTO credit (id,user_id,transaction_no,transaction_type,credits,remaining_credits,status,consumed_detail)
    VALUES ('consume','test-user','consume-tx','consume',-40,0,'active',?)`,
    args: [JSON.stringify([{ creditId: 'grant', creditsConsumed: 40 }])],
  });
  const { revoke, grant, consume } =
    await import('../../src/modules/credits/service');
  await revoke('consume');
  await revoke('consume');
  const balance = await client.execute(
    "SELECT remaining_credits FROM credit WHERE id='grant'"
  );
  assert.equal(balance.rows[0].remaining_credits, 100);
  await assert.rejects(
    grant({ userId: 'test-user', credits: -1 }),
    /positive safe integer/
  );
  await assert.rejects(
    consume({ userId: 'test-user', credits: 0.5 }),
    /positive safe integer/
  );
  client.close();
});

await test('D1 HTTP batches preserve parameter binding in one request', async () => {
  process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
  process.env.D1_DATABASE_ID = 'test-database';
  process.env.CLOUDFLARE_API_TOKEN = 'test-only';
  const originalFetch = globalThis.fetch;
  const calls: any[] = [];
  globalThis.fetch = async (_input, init) => {
    calls.push(JSON.parse(init!.body as string));
    return Response.json({
      success: true,
      result: [
        { results: { rows: [] } },
        { results: { rows: [['name', 'value']] } },
      ],
    });
  };
  try {
    const { createD1HttpDb } = await import('../../src/core/db/d1-http');
    const { config } = await import('../../src/config/db/schema.sqlite');
    const database = createD1HttpDb();
    const untrusted = "x'); DROP TABLE config; --";
    const [, rows] = await database.batch([
      database.insert(config).values({ name: 'name', value: untrusted }),
      database.select().from(config),
    ]);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].batch.length, 2);
    assert.equal(calls[0].batch[0].sql.includes(untrusted), false);
    assert.ok(calls[0].batch[0].params.includes(untrusted));
    assert.deepEqual(rows, [{ name: 'name', value: 'value' }]);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.CLOUDFLARE_API_TOKEN;
  }
});

await test('changing cookies cannot bypass the sensitive-route limit', async () => {
  const { enforceMinIntervalRateLimit } =
    await import('../../src/lib/rate-limit');
  const request = (cookie: string, forwarded: string) =>
    new Request('https://getfilmcraft.org/api/storage/upload-image', {
      method: 'POST',
      headers: {
        cookie,
        'cf-connecting-ip': '192.0.2.20',
        'x-forwarded-for': forwarded,
      },
    });
  const options = { intervalMs: 10_000, keyPrefix: 'regression-test' };
  assert.equal(
    enforceMinIntervalRateLimit(request('a=1', '192.0.2.30'), options),
    null
  );
  assert.equal(
    enforceMinIntervalRateLimit(request('a=2', '192.0.2.31'), options)?.status,
    429
  );
});

await test('D1 interactive transactions fail before the first write', async () => {
  const { createDb } = await import('../../src/core/db/create-db');
  (globalThis as any).__CF_ENV__ = { DB: {} };
  const database = createDb({ database_provider: 'd1', database_url: '' });
  let called = false;
  assert.throws(
    () =>
      database.transaction(() => {
        called = true;
      }),
    /atomic batch/
  );
  assert.equal(called, false);
  delete (globalThis as any).__CF_ENV__;
});

rmSync(directory, { recursive: true, force: true });
