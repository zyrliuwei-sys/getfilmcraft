import { fallbackRelease, type FilmcraftRelease } from '@/config/filmcraft';

const LATEST_RELEASE_API =
  'https://api.github.com/repos/storytold/filmcraft/releases/latest';

// GitHub allows 60 unauthenticated requests per hour per IP, so cache hard:
// per isolate in memory, and on Workers also at the edge (cf.cacheTtl).
const FRESH_MS = 60 * 60 * 1000;
const RETRY_MS = 5 * 60 * 1000;

let cached: { value: FilmcraftRelease; expiresAt: number } | null = null;

interface GithubRelease {
  tag_name?: string;
  published_at?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: { name?: string }[];
}

async function fetchLatestRelease(): Promise<FilmcraftRelease> {
  const res = await fetch(LATEST_RELEASE_API, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'getfilmcraft.org',
    },
    signal: AbortSignal.timeout(4000),
    cf: { cacheTtl: 3600, cacheEverything: true },
  } as RequestInit);
  if (!res.ok) throw new Error(`GitHub releases API returned ${res.status}`);

  const data = (await res.json()) as GithubRelease;
  const version = data.tag_name?.replace(/^v/, '') ?? '';
  if (!/^\d+\.\d+\.\d+$/.test(version) || data.draft || data.prerelease) {
    throw new Error(`Unexpected latest release tag: ${data.tag_name}`);
  }
  const assets = (data.assets ?? [])
    .map((a) => a.name)
    .filter((name): name is string => typeof name === 'string');
  const publishedAt = data.published_at;
  if (
    !publishedAt ||
    !Number.isFinite(Date.parse(publishedAt)) ||
    !assets.length
  ) {
    throw new Error('Latest release is missing its publication date or assets');
  }
  return { version, publishedAt, assets, source: 'github' };
}

/**
 * The latest FilmCraft release on GitHub (version + published file names).
 * Never throws: falls back to the built-in version when GitHub is
 * unreachable, and retries a few minutes later.
 */
export async function getLatestFilmcraftRelease(): Promise<FilmcraftRelease> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.value;
  try {
    const value = await fetchLatestRelease();
    cached = { value, expiresAt: now + FRESH_MS };
    return value;
  } catch (error) {
    console.warn('[filmcraft-release] using fallback version:', error);
    // Keep the last good answer if there is one.
    const value: FilmcraftRelease = cached
      ? {
          ...cached.value,
          source: cached.value.source === 'snapshot' ? 'snapshot' : 'cached',
        }
      : fallbackRelease;
    cached = { value, expiresAt: now + RETRY_MS };
    return value;
  }
}
