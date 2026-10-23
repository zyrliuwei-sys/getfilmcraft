import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { filmcraftImages, filmcraftImageSrcSet } from '@/config/filmcraft';
import { m } from '@/paraglide/messages.js';
import { Reveal } from '@/components/filmcraft/reveal';

import { pillPrimary } from './home';
import { PageIntro } from './page-shell';

const SHORTCUT_KEYS = [
  ',',
  '.',
  ';',
  "'",
  'Q / W',
  'J / K / L',
  'E',
  '⌘K',
  '⌥← / ⌥→',
  '⌃T',
];

export function tutorialSteps() {
  return [
    {
      id: 'install',
      title: m['fc.tut.s1.title'](),
      body: m['fc.tut.s1.body'](),
    },
    {
      id: 'interface',
      title: m['fc.tut.s2.title'](),
      body: m['fc.tut.s2.body'](),
      img: filmcraftImages.hero,
    },
    {
      id: 'import',
      title: m['fc.tut.s3.title'](),
      body: m['fc.tut.s3.body'](),
    },
    {
      id: 'rough-cut',
      title: m['fc.tut.s4.title'](),
      body: m['fc.tut.s4.body'](),
    },
    { id: 'trim', title: m['fc.tut.s5.title'](), body: m['fc.tut.s5.body']() },
    {
      id: 'color',
      title: m['fc.tut.s6.title'](),
      body: m['fc.tut.s6.body'](),
      img: filmcraftImages.color,
    },
    {
      id: 'effects',
      title: m['fc.tut.s7.title'](),
      body: m['fc.tut.s7.body'](),
      img: filmcraftImages.keyframes,
    },
    { id: 'audio', title: m['fc.tut.s8.title'](), body: m['fc.tut.s8.body']() },
    {
      id: 'titles',
      title: m['fc.tut.s9.title'](),
      body: m['fc.tut.s9.body'](),
    },
    {
      id: 'export',
      title: m['fc.tut.s10.title'](),
      body: m['fc.tut.s10.body'](),
      img: filmcraftImages.export,
    },
  ];
}

export function TutorialGuide() {
  const steps = tutorialSteps();
  const shortcuts = [
    m['fc.tut.sc1'](),
    m['fc.tut.sc2'](),
    m['fc.tut.sc3'](),
    m['fc.tut.sc4'](),
    m['fc.tut.sc5'](),
    m['fc.tut.sc6'](),
    m['fc.tut.sc7'](),
    m['fc.tut.sc8'](),
    m['fc.tut.sc9'](),
    m['fc.tut.sc10'](),
  ].map((action, i) => ({ key: SHORTCUT_KEYS[i], action }));

  return (
    <>
      <PageIntro
        label={`${m['fc.tut.label']()} · ${m['fc.common.updated']()}`}
        title={m['fc.tut.title']()}
        description={m['fc.tut.subtitle']()}
      />
      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label={m['fc.tut.toc']()} className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-muted-foreground mb-4 text-sm">
                {m['fc.tut.toc']()}
              </p>
              <ol className="space-y-2.5 text-sm">
                {steps.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-muted-foreground hover:text-foreground flex gap-3 transition-colors"
                    >
                      <span className="w-5 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#shortcuts"
                    className="text-muted-foreground hover:text-foreground flex gap-3 transition-colors"
                  >
                    <span className="w-5">⌘</span>
                    <span>{m['fc.tut.shortcuts.title']()}</span>
                  </a>
                </li>
              </ol>
            </div>
          </nav>

          <div className="min-w-0 space-y-16">
            {steps.map((s, i) => (
              <Reveal key={s.id}>
                <article id={s.id} className="scroll-mt-28">
                  <p className="font-tc text-primary text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-title mt-2 text-2xl sm:text-3xl">
                    {s.title}
                  </h2>
                  <p className="text-muted-foreground mt-4 max-w-3xl text-lg leading-relaxed">
                    {s.body}
                  </p>
                  {s.img && (
                    <img
                      src={s.img}
                      srcSet={filmcraftImageSrcSet(s.img)}
                      sizes="(min-width: 1024px) 800px, calc(100vw - 32px)"
                      alt={s.title}
                      width={1600}
                      height={1000}
                      loading="lazy"
                      fetchPriority="low"
                      className="mt-7 w-full rounded-[10px]"
                    />
                  )}
                </article>
              </Reveal>
            ))}

            <Reveal>
              <section id="shortcuts" className="scroll-mt-28">
                <h2 className="font-title text-2xl sm:text-3xl">
                  {m['fc.tut.shortcuts.title']()}
                </h2>
                <div className="bg-border mt-6 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2">
                  {shortcuts.map((sc) => (
                    <div
                      key={sc.key}
                      className="bg-background flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <span className="text-muted-foreground">{sc.action}</span>
                      <kbd className="border-border bg-muted shrink-0 rounded-md border px-2 py-1 font-mono text-sm">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {m['fc.tut.shortcuts.note']()}
                </p>
              </section>
            </Reveal>

            <Reveal className="border-border flex flex-col items-start justify-between gap-6 rounded-lg border p-7 sm:flex-row sm:items-center sm:p-8">
              <div>
                <h2 className="font-title text-2xl">
                  {m['fc.tut.next.title']()}
                </h2>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {m['fc.tut.next.desc']()}
                </p>
              </div>
              <Link href="/filmcraft-vs-premiere-pro" className={pillPrimary}>
                {m['fc.nav.compare']()}
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
