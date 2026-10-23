import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Download, ExternalLink, Rocket } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  buildDownloads,
  filmcraftLinks,
  releaseLinks,
  type DownloadArch,
  type DownloadKind,
  type FilmcraftRelease,
  type PlatformId,
} from '@/config/filmcraft';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Reveal } from '@/components/filmcraft/reveal';

import { pillGhost, pillPrimary } from './home';
import { CodeBlock, PageIntro, StepList } from './page-shell';

const linuxCmds = (v: string) => `chmod +x filmcraft-${v}-linux-x86_64.AppImage
./filmcraft-${v}-linux-x86_64.AppImage

flatpak install --user filmcraft-${v}-linux-x86_64.flatpak

sudo apt install ./filmcraft-${v}-linux-x86_64.deb   # Debian / Ubuntu
sudo dnf install ./filmcraft-${v}-linux-x86_64.rpm   # Fedora
sudo pacman -U filmcraft-${v}-linux-x86_64.pkg.tar.zst   # Arch`;

const webCmds = (v: string) => `unzip filmcraft-web-${v}.zip
cd filmcraft-web-${v}
python3 -m http.server 8765`;

const SOURCE_CMDS = `git clone https://github.com/storytold/filmcraft.git
cd filmcraft
cargo run --release -p filmcraft`;

const VERIFY_CMDS = `shasum -a 256 <file>             # macOS / Linux
certutil -hashfile <file> SHA256  # Windows`;

function kindLabel(kind: DownloadKind): string {
  const labels: Record<DownloadKind, () => string> = {
    dmg: m['fc.dl.kind.dmg'],
    cli: m['fc.dl.kind.cli'],
    msi: m['fc.dl.kind.msi'],
    portable: m['fc.dl.kind.portable'],
    appimage: () => 'AppImage',
    flatpak: () => 'Flatpak',
    deb: () => '.deb',
    rpm: () => '.rpm',
    arch: m['fc.dl.kind.arch'],
    tarball: () => 'tar.gz',
    web: m['fc.dl.kind.web'],
    freebsd: m['fc.dl.kind.freebsd'],
  };
  return labels[kind]();
}

function archLabel(arch: DownloadArch): string {
  const labels: Record<DownloadArch, () => string> = {
    universal: m['fc.dl.arch.universal'],
    universal_cli: m['fc.dl.arch.universal_cli'],
    x64: () => 'x64',
    arm64: () => 'ARM64',
    x86: m['fc.dl.arch.x86'],
    x86_64: () => 'x86_64',
    riscv64: () => 'RISC-V (riscv64)',
    browser: m['fc.dl.arch.browser'],
  };
  return labels[arch]();
}

function detectPlatform(): PlatformId {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('win')) return 'windows';
  if (ua.includes('linux') && !ua.includes('android')) return 'linux';
  return 'other';
}

export function DownloadGuide({ release }: { release: FilmcraftRelease }) {
  const links = releaseLinks(release.version);
  const allDownloads = useMemo(() => buildDownloads(release), [release]);
  const [platform, setPlatform] = useState<PlatformId>('macos');
  useEffect(() => setPlatform(detectPlatform()), []);

  const tabs: { id: PlatformId; label: string }[] = [
    { id: 'macos', label: m['fc.dl.tab.macos']() },
    { id: 'windows', label: m['fc.dl.tab.windows']() },
    { id: 'linux', label: m['fc.dl.tab.linux']() },
    { id: 'other', label: m['fc.dl.tab.other']() },
  ];

  const info: Record<
    PlatformId,
    { req: string; steps: string[]; code?: string }
  > = {
    macos: {
      req: m['fc.dl.macos.req'](),
      steps: [
        m['fc.dl.macos.s1'](),
        m['fc.dl.macos.s2'](),
        m['fc.dl.macos.s3'](),
        m['fc.dl.macos.s4'](),
      ],
    },
    windows: {
      req: m['fc.dl.windows.req'](),
      steps: [
        m['fc.dl.windows.s1'](),
        m['fc.dl.windows.s2'](),
        m['fc.dl.windows.s3'](),
        m['fc.dl.windows.s4'](),
      ],
    },
    linux: {
      req: m['fc.dl.linux.req'](),
      steps: [
        m['fc.dl.linux.s1'](),
        m['fc.dl.linux.s2'](),
        m['fc.dl.linux.s3'](),
      ],
      code: linuxCmds(release.version),
    },
    other: {
      req: m['fc.dl.other.req'](),
      steps: [
        m['fc.dl.other.s1'](),
        m['fc.dl.other.s2'](),
        m['fc.dl.other.s3'](),
      ],
      code: webCmds(release.version),
    },
  };
  const current = info[platform];
  const files = allDownloads[platform];

  return (
    <>
      <PageIntro
        label={`${m['fc.dl.label']()} · ${m['fc.common.version']()} v${release.version}`}
        title={m['fc.dl.title']()}
        description={m['fc.dl.subtitle']()}
      />

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Launcher */}
          <Reveal className="bg-card flex flex-col gap-6 rounded-lg p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex gap-5">
              <Rocket className="mt-1 size-6 shrink-0" strokeWidth={1.5} />
              <div>
                <h2 className="font-title text-xl">
                  {m['fc.dl.launcher.title']()}
                </h2>
                <p className="text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
                  {m['fc.dl.launcher.desc']()}
                </p>
              </div>
            </div>
            <a
              href={filmcraftLinks.launcher}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(pillGhost, 'shrink-0')}
            >
              {m['fc.dl.launcher.cta']()}
              <ExternalLink className="size-4" />
            </a>
          </Reveal>

          {/* Platform tabs */}
          <Reveal className="bg-card rounded-lg p-2">
            <div
              role="tablist"
              className="grid grid-cols-2 gap-1 sm:grid-cols-4"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={platform === t.id}
                  onClick={() => setPlatform(t.id)}
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    platform === t.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.2fr_1fr]"
            >
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm">{current.req}</p>
                <h3 className="mt-6 mb-3 text-sm font-medium">
                  {m['fc.dl.files']()}
                </h3>
                {files.length === 0 ? (
                  <a
                    href={filmcraftLinks.releases}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
                  >
                    {m['fc.footer.releases']()}{' '}
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : (
                  <ul className="divide-border border-border divide-y rounded-lg border">
                    {files.map((file) => (
                      <li
                        key={file.href}
                        className="flex items-center justify-between gap-4 px-4 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-2 font-medium">
                            {kindLabel(file.kind)}
                            {file.recommended && (
                              <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[11px] font-medium">
                                {m['fc.dl.recommended']()}
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {archLabel(file.arch)}
                          </p>
                        </div>
                        <a
                          href={file.href}
                          rel="nofollow noopener"
                          className={cn(
                            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                            file.recommended
                              ? 'bg-primary text-primary-foreground hover:bg-primary/85'
                              : 'border-border hover:bg-accent border'
                          )}
                        >
                          <Download className="size-4" />
                          {m['fc.dl.download']()}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="mb-4 text-sm font-medium">
                  {m['fc.dl.steps']()}
                </h3>
                <StepList steps={current.steps} />
                {current.code && <CodeBlock>{current.code}</CodeBlock>}
              </div>
            </div>
          </Reveal>

          {/* Verify / source / notes */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="bg-card min-w-0 rounded-lg p-7 sm:p-8">
              <h2 className="font-title text-xl">
                {m['fc.dl.verify.title']()}
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {m['fc.dl.verify.desc']()}
              </p>
              <CodeBlock>{VERIFY_CMDS}</CodeBlock>
              <a
                href={links.checksums}
                rel="nofollow noopener"
                className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-1.5 text-sm"
              >
                {m['fc.dl.verify.cta']()} <Download className="size-3.5" />
              </a>
            </Reveal>
            <Reveal
              delay={80}
              className="bg-card min-w-0 rounded-lg p-7 sm:p-8"
            >
              <h2 className="font-title text-xl">
                {m['fc.dl.source.title']()}
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {m['fc.dl.source.desc']()}
              </p>
              <CodeBlock>{SOURCE_CMDS}</CodeBlock>
            </Reveal>
            <Reveal
              delay={160}
              className="bg-card min-w-0 rounded-lg p-7 sm:p-8"
            >
              <h2 className="font-title text-xl">{m['fc.dl.notes.title']()}</h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {m['fc.dl.notes.desc']()}
              </p>
              <a
                href={links.releaseNotes}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-1.5 text-sm"
              >
                {m['fc.dl.notes.cta']()} <ExternalLink className="size-3.5" />
              </a>
            </Reveal>
          </div>

          <Reveal className="border-border flex flex-col items-start justify-between gap-6 rounded-lg border p-7 sm:flex-row sm:items-center sm:p-8">
            <h2 className="font-title text-2xl">{m['fc.dl.next.title']()}</h2>
            <Link href="/tutorial" className={pillPrimary}>
              {m['fc.dl.next.cta']()}
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
