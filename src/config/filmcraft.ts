/**
 * FilmCraft facts used across the guide pages (version, download links,
 * official resources). Sourced from https://getartcraft.com/apps/filmcraft
 * and the storytold/filmcraft GitHub README.
 *
 * The version shown on the site comes from the latest GitHub release at
 * request time (modules/filmcraft-release); FILMCRAFT_VERSION is only the
 * fallback used when GitHub can't be reached.
 */
export const FILMCRAFT_VERSION = '0.12.0';

/** The latest release as the pages see it. `assets` = published file names,
 *  or null when unknown (fallback), in which case every file is listed. */
export interface FilmcraftRelease {
  version: string;
  assets: string[] | null;
}

export const fallbackRelease: FilmcraftRelease = {
  version: FILMCRAFT_VERSION,
  assets: null,
};

const releaseDownload = (version: string, name: string) =>
  `https://github.com/storytold/filmcraft/releases/download/v${version}/${name}`;

/** Links that point at one specific release. */
export function releaseLinks(version: string) {
  return {
    releaseNotes: `https://github.com/storytold/filmcraft/releases/tag/v${version}`,
    checksums: releaseDownload(version, 'SHA256SUMS.txt'),
    webBuild: releaseDownload(version, `filmcraft-web-${version}.zip`),
  };
}

export const filmcraftLinks = {
  official: 'https://getartcraft.com/apps/filmcraft',
  artcraft: 'https://getartcraft.com/',
  github: 'https://github.com/storytold/filmcraft',
  releases: 'https://github.com/storytold/filmcraft/releases',
  // Always the newest launcher release, so the link never goes stale.
  launcher: 'https://github.com/storytold/craft-launcher/releases/latest',
  discord: 'https://discord.gg/artcraft',
  rustup: 'https://rustup.rs',
  premiere: 'https://www.adobe.com/products/premiere.html',
};

/**
 * Where the self-hosted WebAssembly build of FilmCraft lives. The .wasm file
 * (~41 MB) is over the Workers static-asset limit, so it is hosted separately
 * (e.g. an R2 bucket on app.getfilmcraft.org). Empty = no hosted editor yet.
 */
export const filmcraftWebAppUrl: string =
  import.meta.env.VITE_FILMCRAFT_WEB_URL ?? '';

export type PlatformId = 'macos' | 'windows' | 'linux' | 'other';

/** Package type; the page translates it (fc.dl.kind.*). */
export type DownloadKind =
  | 'dmg'
  | 'cli'
  | 'msi'
  | 'portable'
  | 'appimage'
  | 'flatpak'
  | 'deb'
  | 'rpm'
  | 'arch'
  | 'tarball'
  | 'web'
  | 'freebsd';

/** CPU target; `universal`, `x86` and `browser` are translated (fc.dl.arch.*). */
export type DownloadArch =
  | 'universal'
  | 'universal_cli'
  | 'x64'
  | 'arm64'
  | 'x86'
  | 'x86_64'
  | 'riscv64'
  | 'browser';

export interface DownloadFile {
  kind: DownloadKind;
  arch: DownloadArch;
  href: string;
  recommended?: boolean;
}

/**
 * Installers for one release, grouped by platform tab. When the release's
 * asset list is known, files it doesn't contain (e.g. a dropped target) are
 * left out.
 */
export function buildDownloads(
  release: FilmcraftRelease
): Record<PlatformId, DownloadFile[]> {
  const v = release.version;
  const file = (
    kind: DownloadKind,
    arch: DownloadArch,
    name: string,
    recommended?: boolean
  ): DownloadFile & { name: string } => ({
    kind,
    arch,
    name,
    href: releaseDownload(v, name),
    recommended,
  });
  const linux = (arch: DownloadArch, suffix: string, recommended?: boolean) => [
    file(
      'appimage',
      arch,
      `filmcraft-${v}-linux-${suffix}.AppImage`,
      recommended
    ),
    file('flatpak', arch, `filmcraft-${v}-linux-${suffix}.flatpak`),
    file('deb', arch, `filmcraft-${v}-linux-${suffix}.deb`),
    file('rpm', arch, `filmcraft-${v}-linux-${suffix}.rpm`),
    file('arch', arch, `filmcraft-${v}-linux-${suffix}.pkg.tar.zst`),
    file('tarball', arch, `filmcraft-${v}-linux-${suffix}.tar.gz`),
  ];

  const all = {
    macos: [
      file('dmg', 'universal', `filmcraft-${v}-macos-universal.dmg`, true),
      file('cli', 'universal_cli', `filmcraft-cli-${v}-macos-universal.zip`),
    ],
    windows: [
      file('msi', 'x64', `filmcraft-${v}-windows-x64.msi`, true),
      file('portable', 'x64', `filmcraft-${v}-windows-x64-portable.zip`),
      file('msi', 'arm64', `filmcraft-${v}-windows-arm64.msi`),
      file('portable', 'arm64', `filmcraft-${v}-windows-arm64-portable.zip`),
      file('msi', 'x86', `filmcraft-${v}-windows-x86.msi`),
      file('portable', 'x86', `filmcraft-${v}-windows-x86-portable.zip`),
    ],
    linux: [
      ...linux('x86_64', 'x86_64', true),
      ...linux('arm64', 'aarch64'),
      file('deb', 'riscv64', `filmcraft-${v}-linux-riscv64.deb`),
      file('rpm', 'riscv64', `filmcraft-${v}-linux-riscv64.rpm`),
      file('tarball', 'riscv64', `filmcraft-${v}-linux-riscv64.tar.gz`),
    ],
    other: [
      file('web', 'browser', `filmcraft-web-${v}.zip`, true),
      file('freebsd', 'x86_64', `filmcraft-${v}-freebsd-x86_64.tar.gz`),
    ],
  };

  const published = release.assets ? new Set(release.assets) : null;
  const keep = (files: (DownloadFile & { name: string })[]) =>
    files
      .filter((x) => !published || published.has(x.name))
      .map(({ name: _name, ...rest }) => rest);
  return {
    macos: keep(all.macos),
    windows: keep(all.windows),
    linux: keep(all.linux),
    other: keep(all.other),
  };
}

/** Premiere Pro pricing as listed on adobe.com (US, checked 2026-10). */
export const PREMIERE_PRICE_MONTHLY = 'US$22.99/mo';

export const filmcraftImages = {
  hero: '/imgs/filmcraft/hero.webp',
  color: '/imgs/filmcraft/color.webp',
  keyframes: '/imgs/filmcraft/keyframes.webp',
  export: '/imgs/filmcraft/export.webp',
};

/** Optimized variants of the guide's own screenshots. */
export function filmcraftImageSrcSet(src: string) {
  return [480, 800, 1200]
    .map((width) => `${src.replace('.webp', `-${width}.webp`)} ${width}w`)
    .concat(`${src} 1600w`)
    .join(', ');
}
