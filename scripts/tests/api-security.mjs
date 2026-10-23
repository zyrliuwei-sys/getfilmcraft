// Production-server security checks against a disposable SQLite database.
// Run after pnpm build; this script never writes to the project's remote D1.
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';

const directory = mkdtempSync(join(tmpdir(), 'filmcraft-api-security-'));
const probe = createServer();
await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const base = `http://localhost:${port}`;
const password = randomBytes(18).toString('base64url');
const env = {
  ...process.env,
  DATABASE_PROVIDER: 'sqlite',
  DATABASE_URL: `file:${join(directory, 'api.sqlite')}`,
  AUTH_SECRET: randomBytes(32).toString('base64url'),
  VITE_APP_URL: base,
  AUTH_URL: base,
  PORT: String(port),
  NODE_ENV: 'production',
};
let server;
try {
  execFileSync(
    './node_modules/.bin/drizzle-kit',
    ['push', '--config=drizzle.config.ts'],
    { env, stdio: 'pipe' }
  );
  execFileSync(
    './node_modules/.bin/tsx',
    [
      'scripts/init-rbac.ts',
      '--admin-email=audit-admin@example.invalid',
      `--admin-password=${password}`,
    ],
    { env, stdio: 'pipe' }
  );
  server = spawn(process.execPath, ['.output/server/index.mjs'], {
    env,
    stdio: 'ignore',
  });
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      ready = (await fetch(base + '/')).ok;
    } catch {}
    if (ready) break;
    await setTimeout(250);
  }
  assert.ok(ready, 'isolated production server starts');
  const request = (path, { cookie, method = 'GET', body, headers = {} } = {}) =>
    fetch(base + path, {
      method,
      headers: {
        origin: base,
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...(cookie ? { cookie } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  const sessionCookie = (response) =>
    response.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ');
  for (const path of [
    '/api/admin/config',
    '/api/admin/users',
    '/api/apikeys',
    '/api/user/orders',
  ]) {
    assert.equal(
      (await request(path)).status,
      401,
      `anonymous access denied: ${path}`
    );
  }
  const signIn = await request('/api/auth/sign-in/email', {
    method: 'POST',
    body: { email: 'audit-admin@example.invalid', password },
  });
  assert.equal(signIn.status, 200, 'super-admin login works');
  const adminCookie = sessionCookie(signIn);
  const adminPermissions = await request('/api/user/permissions', {
    cookie: adminCookie,
  }).then((r) => r.json());
  assert.equal(adminPermissions.data.isSuperAdmin, true);
  const signUp = await request('/api/auth/sign-up/email', {
    method: 'POST',
    body: { name: 'Audit user', email: 'audit-user@example.invalid', password },
  });
  assert.equal(signUp.status, 200, 'regular-user account created locally');
  const userCookie = sessionCookie(signUp);
  assert.ok(userCookie, 'new user session created');
  for (const [path, method, body] of [
    ['/api/admin/config', 'GET'],
    ['/api/admin/users', 'GET'],
    ['/api/admin/roles/assign', 'POST', { userId: 'test', roleId: 'test' }],
    ['/api/admin/config', 'POST', { auth_secret: 'attempted-overwrite' }],
  ]) {
    assert.equal(
      (await request(path, { cookie: userCookie, method, body })).status,
      403,
      `regular-user escalation denied: ${path}`
    );
  }
  const ownTicket = await request('/api/tickets', {
    cookie: adminCookie,
    method: 'POST',
    body: { title: 'Audit ticket', content: 'Local test record.' },
  }).then((r) => r.json());
  assert.equal(ownTicket.code, 0);
  const otherTicket = await request(`/api/tickets/${ownTicket.data.id}`, {
    cookie: userCookie,
  }).then((r) => r.json());
  assert.equal(
    otherTicket.code,
    -1,
    'users cannot read another account’s ticket'
  );
  const hostile = await request('/api/admin/config', {
    cookie: adminCookie,
    method: 'POST',
    headers: { origin: 'https://attacker.invalid' },
    body: {},
  });
  assert.equal(hostile.status, 403, 'cross-origin admin mutation denied');
  const form = new FormData();
  form.append(
    'files',
    new File(['<svg onload="alert(1)"></svg>'], 'spoof.png', {
      type: 'image/png',
    })
  );
  const upload = await fetch(base + '/api/storage/upload-image', {
    method: 'POST',
    headers: { cookie: userCookie },
    body: form,
  });
  assert.equal(upload.status, 400, 'spoofed image upload denied');
  assert.match((await upload.json()).message, /Invalid image/);
  const token = await request('/api/auth/token', { cookie: adminCookie });
  assert.equal(token.headers.get('cache-control'), 'private, no-store');
  console.log(
    'PASS: production login, anonymous guards, non-admin escalation, ticket ownership, CSRF, upload signature and sensitive caching.'
  );
} finally {
  if (server) {
    server.kill('SIGTERM');
    if (server.exitCode === null)
      await new Promise((resolve) => server.once('exit', resolve));
  }
  rmSync(directory, { recursive: true, force: true });
}
