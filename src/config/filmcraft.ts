/**
 * FilmCraft facts used across the guide pages (version, download links,
 * official resources). Sourced from https://getartcraft.com/apps/filmcraft
 * and the storytold/filmcraft GitHub README — update on each new release.
 */

export const FILMCRAFT_VERSION = '0.9.0';
export const LAUNCHER_VERSION = '0.5.1';

const RELEASE = `https://github.com/storytold/filmcraft/releases/download/v${FILMCRAFT_VERSION}`;

export const filmcraftLinks = {
  official: 'https://getartcraft.com/apps/filmcraft',
  artcraft: 'https://getartcraft.com/',
  github: 'https://github.com/storytold/filmcraft',
  releases: 'https://github.com/storytold/filmcraft/releases',
  releaseNotes: `https://github.com/storytold/filmcraft/releases/tag/v${FILMCRAFT_VERSION}`,
  checksums: `${RELEASE}/SHA256SUMS.txt`,
  webBuild: `${RELEASE}/filmcraft-web-${FILMCRAFT_VERSION}.zip`,
  launcher: `https://github.com/storytold/craft-launcher/releases/tag/v${LAUNCHER_VERSION}`,
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

export interface DownloadFile {
  label: string;
  arch: string;
  href: string;
  recommended?: boolean;
}

const f = (name: string) => `${RELEASE}/${name}`;
const v = FILMCRAFT_VERSION;

export const downloads: Record<PlatformId, DownloadFile[]> = {
  macos: [
    {
      label: 'DMG installer',
      arch: 'Universal (Apple silicon + Intel)',
      href: f(`filmcraft-${v}-macos-universal.dmg`),
      recommended: true,
    },
    {
      label: 'Command-line tools (zip)',
      arch: 'Universal',
      href: f(`filmcraft-cli-${v}-macos-universal.zip`),
    },
  ],
  windows: [
    {
      label: 'MSI installer',
      arch: 'x64',
      href: f(`filmcraft-${v}-windows-x64.msi`),
      recommended: true,
    },
    {
      label: 'Portable (zip)',
      arch: 'x64',
      href: f(`filmcraft-${v}-windows-x64-portable.zip`),
    },
    {
      label: 'MSI installer',
      arch: 'ARM64',
      href: f(`filmcraft-${v}-windows-arm64.msi`),
    },
    {
      label: 'Portable (zip)',
      arch: 'ARM64',
      href: f(`filmcraft-${v}-windows-arm64-portable.zip`),
    },
    {
      label: 'MSI installer',
      arch: 'x86 (32-bit)',
      href: f(`filmcraft-${v}-windows-x86.msi`),
    },
    {
      label: 'Portable (zip)',
      arch: 'x86 (32-bit)',
      href: f(`filmcraft-${v}-windows-x86-portable.zip`),
    },
  ],
  linux: [
    {
      label: 'AppImage',
      arch: 'x86_64',
      href: f(`filmcraft-${v}-linux-x86_64.AppImage`),
      recommended: true,
    },
    {
      label: 'Flatpak',
      arch: 'x86_64',
      href: f(`filmcraft-${v}-linux-x86_64.flatpak`),
    },
    {
      label: '.deb',
      arch: 'x86_64',
      href: f(`filmcraft-${v}-linux-x86_64.deb`),
    },
    {
      label: '.rpm',
      arch: 'x86_64',
      href: f(`filmcraft-${v}-linux-x86_64.rpm`),
    },
    {
      label: 'tar.gz',
      arch: 'x86_64',
      href: f(`filmcraft-${v}-linux-x86_64.tar.gz`),
    },
    {
      label: 'AppImage',
      arch: 'ARM64',
      href: f(`filmcraft-${v}-linux-aarch64.AppImage`),
    },
    {
      label: 'Flatpak',
      arch: 'ARM64',
      href: f(`filmcraft-${v}-linux-aarch64.flatpak`),
    },
    {
      label: '.deb',
      arch: 'ARM64',
      href: f(`filmcraft-${v}-linux-aarch64.deb`),
    },
    {
      label: '.rpm',
      arch: 'ARM64',
      href: f(`filmcraft-${v}-linux-aarch64.rpm`),
    },
    {
      label: 'tar.gz',
      arch: 'ARM64',
      href: f(`filmcraft-${v}-linux-aarch64.tar.gz`),
    },
  ],
  other: [
    {
      label: 'Web build (WebAssembly, self-host)',
      arch: 'Any modern browser',
      href: f(`filmcraft-web-${v}.zip`),
      recommended: true,
    },
    {
      label: 'FreeBSD tarball',
      arch: 'x86_64',
      href: f(`filmcraft-${v}-freebsd-x86_64.tar.gz`),
    },
  ],
};

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
