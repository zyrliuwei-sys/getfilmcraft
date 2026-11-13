import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  buildDownloads,
  fallbackRelease,
  releaseLinks,
} from '../../src/config/filmcraft';
import { getLatestFilmcraftRelease } from '../../src/modules/filmcraft-release/service';

test('release metadata stays consistent through outages, caching, recovery and invalid responses', async (t) => {
  let now = Date.parse('2026-11-13T00:00:00Z');
  let requests = 0;
  let response: () => Response = () => new Response(null, { status: 503 });
  t.mock.method(Date, 'now', () => now);
  t.mock.method(console, 'warn', () => {});
  t.mock.method(globalThis, 'fetch', async () => {
    requests++;
    return response();
  });

  const snapshot = await getLatestFilmcraftRelease();
  assert.deepEqual(snapshot, fallbackRelease);
  assert.equal(snapshot.source, 'snapshot');
  await getLatestFilmcraftRelease();
  assert.equal(
    requests,
    1,
    'an outage must not trigger a request on every page'
  );

  // A future release fixture proves the version, date and assets move together.
  const next = {
    tag_name: 'v0.21.0',
    published_at: '2026-11-15T02:10:00Z',
    assets: [{ name: 'filmcraft-0.21.0-windows-arm64.msi' }],
  };
  response = () => Response.json(next);
  now += 5 * 60 * 1000 + 1;
  const fresh = await getLatestFilmcraftRelease();
  assert.equal(fresh.version, '0.21.0');
  assert.equal(fresh.publishedAt, next.published_at);
  assert.equal(fresh.source, 'github');
  assert.deepEqual(
    buildDownloads(fresh).windows.map((file) => file.href),
    [
      'https://github.com/storytold/filmcraft/releases/download/v0.21.0/filmcraft-0.21.0-windows-arm64.msi',
    ]
  );
  assert.deepEqual(buildDownloads(fresh).macos, []);
  await getLatestFilmcraftRelease();
  assert.equal(
    requests,
    2,
    'successful metadata must be reused during its TTL'
  );

  now += 60 * 60 * 1000 + 1;
  response = () => new Response(null, { status: 429 });
  const stale = await getLatestFilmcraftRelease();
  assert.deepEqual(stale, { ...fresh, source: 'cached' });

  for (const invalid of [
    { ...next, published_at: 'not a date' },
    { ...next, assets: [] },
    { ...next, tag_name: 'v0.22.0/invalid' },
    { ...next, prerelease: true },
    { ...next, draft: true },
  ]) {
    now += 5 * 60 * 1000 + 1;
    response = () => Response.json(invalid);
    assert.deepEqual(await getLatestFilmcraftRelease(), stale);
  }

  now += 5 * 60 * 1000 + 1;
  response = () => Response.json(next);
  assert.deepEqual(await getLatestFilmcraftRelease(), fresh);
});

test('every snapshot download points to an asset from the same verified release', () => {
  const assets = new Set(fallbackRelease.assets);
  const links = releaseLinks(fallbackRelease.version);
  const urls = [
    ...Object.values(buildDownloads(fallbackRelease))
      .flat()
      .map((file) => file.href),
    links.checksums,
    links.webBuild,
  ];
  assert.ok(urls.length > 0);
  for (const url of urls) {
    assert.ok(url.includes(`/download/v${fallbackRelease.version}/`), url);
    assert.ok(assets.has(url.split('/').at(-1)!), url);
  }
  assert.equal(fallbackRelease.publishedAt, '2026-11-12T00:26:09Z');
  assert.ok(
    !buildDownloads(fallbackRelease).windows.some((file) => file.arch === 'x86')
  );
});
