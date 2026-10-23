import { Download, ExternalLink, Maximize2, MonitorPlay } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  filmcraftLinks,
  filmcraftWebAppUrl,
  releaseLinks,
} from '@/config/filmcraft';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Reveal } from '@/components/filmcraft/reveal';

import { pillGhost, pillPrimary } from './home';
import { CodeBlock, PageIntro, StepList } from './page-shell';

function withFlag(url: string, flag: string) {
  return url + (url.includes('?') ? '&' : '?') + flag;
}

function HostedEditor({ url }: { url: string }) {
  return (
    <Reveal className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={url} target="_blank" rel="noopener" className={pillPrimary}>
          <MonitorPlay className="size-4" />
          {m['fc.online.launch']()}
        </a>
        <a
          href={withFlag(url, 'webgl')}
          target="_blank"
          rel="noopener"
          className={pillGhost}
        >
          {m['fc.online.webgl']()}
        </a>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-black">
        <iframe
          src={url}
          title="FilmCraft video editor"
          loading="lazy"
          allow="fullscreen; clipboard-read; clipboard-write"
          allowFullScreen
          className="block h-[70vh] min-h-[520px] w-full border-0"
        />
      </div>
      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-sm">
        <p>{m['fc.online.loading_note']()}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="hover:text-foreground inline-flex items-center gap-1.5"
        >
          <Maximize2 className="size-3.5" />
          {m['fc.online.fullscreen']()}
        </a>
      </div>
    </Reveal>
  );
}

function PendingEditor({ webBuild }: { webBuild: string }) {
  return (
    <Reveal className="bg-card rounded-lg p-7 sm:p-10">
      <MonitorPlay className="size-7" strokeWidth={1.5} />
      <h2 className="font-title mt-6 text-2xl sm:text-3xl">
        {m['fc.online.pending.title']()}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
        {m['fc.online.pending.desc']()}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={webBuild} rel="nofollow noopener" className={pillPrimary}>
          <Download className="size-4" />
          {m['fc.online.pending.web']()}
        </a>
        <Link href="/download" className={pillGhost}>
          {m['fc.online.pending.desktop']()}
        </Link>
      </div>
    </Reveal>
  );
}

export function OnlineGuide({ version }: { version: string }) {
  const webBuild = releaseLinks(version).webBuild;
  const url = filmcraftWebAppUrl;
  const reqs = [
    m['fc.online.req.r1'](),
    m['fc.online.req.r2'](),
    m['fc.online.req.r3'](),
    m['fc.online.req.r4'](),
  ];
  const steps = [
    m['fc.online.selfhost.s1']({ version }),
    m['fc.online.selfhost.s2'](),
    m['fc.online.selfhost.s3'](),
  ];

  return (
    <>
      <PageIntro
        label={m['fc.online.label']()}
        title={m['fc.online.title']()}
        description={m['fc.online.subtitle']()}
      />
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl space-y-6">
          {url ? (
            <HostedEditor url={url} />
          ) : (
            <PendingEditor webBuild={webBuild} />
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal className="bg-card min-w-0 rounded-lg p-7 sm:p-8">
              <h2 className="font-title text-xl">
                {m['fc.online.selfhost.title']()}
              </h2>
              <div className="mt-6">
                <StepList steps={steps} />
              </div>
              <CodeBlock>{`cd filmcraft-web-${version}\npython3 -m http.server 8765`}</CodeBlock>
              <a
                href={webBuild}
                rel="nofollow noopener"
                className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-1.5 text-sm"
              >
                filmcraft-web-{version}.zip <Download className="size-3.5" />
              </a>
            </Reveal>
            <Reveal
              delay={80}
              className="bg-card min-w-0 rounded-lg p-7 sm:p-8"
            >
              <h2 className="font-title text-xl">
                {m['fc.online.req.title']()}
              </h2>
              <ul className="mt-5 space-y-3">
                {reqs.map((r) => (
                  <li
                    key={r}
                    className="text-muted-foreground flex gap-3 leading-relaxed"
                  >
                    <span className="bg-primary mt-2.5 size-1 shrink-0 rounded-full" />
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="border-border flex flex-col items-start justify-between gap-6 rounded-lg border p-7 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="font-title text-2xl">
                {m['fc.online.vs.title']()}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                {m['fc.online.vs.desc']()}
              </p>
            </div>
            <Link href="/download" className={cn(pillPrimary, 'shrink-0')}>
              <Download className="size-4" />
              {m['fc.home.hero.cta_download']()}
            </Link>
          </Reveal>
          <p className="text-muted-foreground text-center text-xs">
            <a
              href={filmcraftLinks.official}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1"
            >
              {m['fc.footer.official_page']()}{' '}
              <ExternalLink className="size-3" />
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
