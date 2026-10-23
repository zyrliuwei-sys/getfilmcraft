import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Download,
  Globe,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  filmcraftImages,
  filmcraftImageSrcSet,
  filmcraftLinks,
} from '@/config/filmcraft';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { CompareTable } from '@/components/filmcraft/compare-table';
import { Reveal } from '@/components/filmcraft/reveal';
import { SectionHeading } from '@/components/filmcraft/section-heading';
import { buttonVariants } from '@/components/ui/button';

import { compareColumns, compareRows } from './compare-rows';

export const pillPrimary = cn(
  buttonVariants({ size: 'lg' }),
  'h-12 gap-2 rounded-full px-7 text-[15px] font-semibold'
);
export const pillGhost = cn(
  buttonVariants({ size: 'lg', variant: 'outline' }),
  'border-border h-12 gap-2 rounded-full bg-transparent px-7 text-[15px] hover:bg-accent'
);

const section = 'px-4 py-16 sm:px-6 sm:py-24';
const container = 'mx-auto max-w-6xl';

function Hero() {
  return (
    <section className="px-4 pt-14 sm:px-6 sm:pt-20">
      <div className={container}>
        <p className="text-primary text-sm font-medium">
          {m['fc.home.hero.eyebrow']()}
        </p>
        <h1 className="font-title mt-5 max-w-6xl text-[2.2rem] leading-[1.06] text-balance sm:text-5xl lg:text-[3.5rem]">
          {m['fc.home.hero.title']()}
        </h1>
        <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed text-pretty">
            {m['fc.home.hero.subtitle']()}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/download" className={pillPrimary}>
              <Download className="size-4" />
              {m['fc.home.hero.cta_download']()}
            </Link>
            <Link href="/online" className={pillGhost}>
              <Globe className="size-4" />
              {m['fc.home.hero.cta_online']()}
            </Link>
          </div>
        </div>
      </div>

      <figure className="mx-auto mt-12 max-w-7xl sm:mt-16">
        <div className="rounded-[10px]">
          <img
            src={filmcraftImages.hero}
            srcSet={filmcraftImageSrcSet(filmcraftImages.hero)}
            sizes="(min-width: 1280px) 1280px, calc(100vw - 32px)"
            alt={m['fc.home.hero.image_alt']()}
            width={1600}
            height={1000}
            fetchPriority="high"
            className="letterbox-open w-full rounded-[10px]"
          />
        </div>
        <figcaption className="font-tc text-muted-foreground mx-auto mt-4 max-w-6xl text-xs">
          {m['fc.home.hero.caption']()}
        </figcaption>
      </figure>
    </section>
  );
}

function WhatIs({ version }: { version: string }) {
  const specs = [
    [m['fc.home.spec.developer'](), 'ArtCraft'],
    [m['fc.home.spec.license'](), 'MIT / Apache-2.0'],
    [m['fc.home.spec.version'](), version],
    [m['fc.home.spec.platforms'](), m['fc.home.spec.platforms_value']()],
    [m['fc.home.spec.language'](), 'Rust'],
    [m['fc.home.spec.price'](), m['fc.home.spec.free']()],
  ];
  return (
    <section id="what-is-filmcraft" className={section}>
      <div
        className={cn(
          container,
          'grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20'
        )}
      >
        <Reveal>
          <SectionHeading title={m['fc.home.what.title']()} />
          <p className="mt-8 text-xl leading-relaxed text-pretty sm:text-2xl sm:leading-snug">
            {m['fc.home.what.lead']()}
          </p>
          <div className="text-muted-foreground mt-6 space-y-5 text-[17px] leading-relaxed">
            <p>{m['fc.home.what.p2']()}</p>
            <p>{m['fc.home.what.p3']()}</p>
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:pt-24">
          <dl className="bg-card rounded-lg px-6 py-2">
            {specs.map(([k, v]) => (
              <div
                key={k}
                className="border-border flex justify-between gap-6 border-b py-4 last:border-b-0"
              >
                <dt className="font-tc text-muted-foreground text-xs leading-6">
                  {k}
                </dt>
                <dd className="text-right text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  const textCell = 'bg-card flex flex-col justify-end rounded-lg p-7';
  const imageCells = [
    {
      img: filmcraftImages.keyframes,
      title: m['fc.home.features.effects.title'](),
      desc: m['fc.home.features.effects.desc'](),
    },
    {
      img: filmcraftImages.export,
      title: m['fc.home.features.codecs.title'](),
      desc: m['fc.home.features.codecs.desc'](),
    },
  ];
  return (
    <section id="features" className={section}>
      <div className={container}>
        <Reveal>
          <SectionHeading title={m['fc.home.features.title']()} />
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          <Reveal className="bg-card overflow-hidden rounded-lg lg:col-span-4 lg:row-span-2">
            <img
              src={filmcraftImages.color}
              srcSet={filmcraftImageSrcSet(filmcraftImages.color)}
              sizes="(min-width: 1024px) 800px, calc(100vw - 32px)"
              alt={m['fc.home.features.color.title']()}
              width={1600}
              height={1000}
              loading="lazy"
              fetchPriority="low"
              className="aspect-[16/9] w-full object-cover object-top"
            />
            <div className="p-7">
              <h3 className="font-title text-xl">
                {m['fc.home.features.color.title']()}
              </h3>
              <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">
                {m['fc.home.features.color.desc']()}
              </p>
            </div>
          </Reveal>
          <Reveal delay={80} className={cn(textCell, 'lg:col-span-2')}>
            <h3 className="font-title text-xl">
              {m['fc.home.features.timeline.title']()}
            </h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {m['fc.home.features.timeline.desc']()}
            </p>
          </Reveal>
          <Reveal delay={160} className={cn(textCell, 'lg:col-span-2')}>
            <p className="font-tc text-primary text-2xl">29.97 DF</p>
            <h3 className="font-title mt-6 text-xl">
              {m['fc.home.features.frame.title']()}
            </h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {m['fc.home.features.frame.desc']()}
            </p>
          </Reveal>
          {imageCells.map((c, i) => (
            <Reveal
              key={c.title}
              delay={i * 80}
              className="bg-card overflow-hidden rounded-lg lg:col-span-3"
            >
              <img
                src={c.img}
                srcSet={filmcraftImageSrcSet(c.img)}
                sizes="(min-width: 1024px) 800px, calc(100vw - 32px)"
                alt={c.title}
                width={1600}
                height={1000}
                loading="lazy"
                fetchPriority="low"
                className="aspect-[2/1] w-full object-cover object-top"
              />
              <div className="p-7">
                <h3 className="font-title text-xl">{c.title}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal className="bg-card grid gap-4 rounded-lg p-7 sm:grid-cols-[1fr_1.4fr] sm:items-center lg:col-span-6">
            <h3 className="font-title text-xl">
              {m['fc.home.features.audio.title']()}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {m['fc.home.features.audio.desc']()}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Review() {
  const columns = [
    {
      title: m['fc.home.review.pros'](),
      mark: '+',
      items: [
        m['fc.home.review.pro1'](),
        m['fc.home.review.pro2'](),
        m['fc.home.review.pro3'](),
        m['fc.home.review.pro4'](),
        m['fc.home.review.pro5'](),
      ],
    },
    {
      title: m['fc.home.review.cons'](),
      mark: '-',
      items: [
        m['fc.home.review.con1'](),
        m['fc.home.review.con2'](),
        m['fc.home.review.con3'](),
        m['fc.home.review.con4'](),
        m['fc.home.review.con5'](),
      ],
    },
  ];
  return (
    <section id="review" className={section}>
      <div className={container}>
        <Reveal>
          <SectionHeading
            title={m['fc.home.review.title']()}
            description={m['fc.home.review.intro']()}
          />
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          {columns.map((col, ci) => (
            <Reveal key={col.title} delay={ci * 100}>
              <h3 className="font-tc text-muted-foreground text-xs">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-4">
                {col.items.map((it) => (
                  <li
                    key={it}
                    className="flex gap-4 text-[17px] leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'font-tc w-3 shrink-0',
                        ci === 0 ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {col.mark}
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="border-primary mt-14 max-w-3xl border-l-2 pl-6 text-xl leading-relaxed text-pretty">
            {m['fc.home.review.verdict']()}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ArtCraft() {
  const apps = [
    { name: 'PhotoCraft', role: m['fc.home.artcraft.photo']() },
    { name: 'VectorCraft', role: m['fc.home.artcraft.vector']() },
    { name: 'PdfCraft', role: m['fc.home.artcraft.pdf']() },
    { name: 'FilmCraft', role: m['fc.home.artcraft.film'](), current: true },
  ];
  return (
    <section id="artcraft" className={section}>
      <div className={cn(container, 'grid gap-12 lg:grid-cols-2 lg:gap-20')}>
        <Reveal>
          <SectionHeading title={m['fc.home.artcraft.title']()} />
          <div className="text-muted-foreground mt-8 space-y-5 text-[17px] leading-relaxed">
            <p>{m['fc.home.artcraft.p1']()}</p>
            <p>{m['fc.home.artcraft.p2']()}</p>
          </div>
          <Link
            href="/download"
            className="text-primary mt-8 inline-flex items-center gap-2 font-medium hover:underline"
          >
            {m['fc.home.artcraft.cta']()}
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <Reveal delay={120} className="self-center">
          <ul>
            {apps.map((a) => (
              <li
                key={a.name}
                className="border-border flex items-baseline justify-between gap-6 border-b py-5"
              >
                <span
                  className={cn(
                    'font-title text-3xl sm:text-5xl',
                    a.current ? 'text-primary' : 'text-foreground/35'
                  )}
                >
                  {a.name}
                </span>
                <span className="font-tc text-muted-foreground text-xs">
                  {a.role}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Platforms() {
  const items = [
    {
      title: m['fc.home.platforms.mac.title'](),
      desc: m['fc.home.platforms.mac.desc'](),
      href: '/download',
    },
    {
      title: m['fc.home.platforms.win.title'](),
      desc: m['fc.home.platforms.win.desc'](),
      href: '/download',
    },
    {
      title: m['fc.home.platforms.linux.title'](),
      desc: m['fc.home.platforms.linux.desc'](),
      href: '/download',
    },
    {
      title: m['fc.home.platforms.web.title'](),
      desc: m['fc.home.platforms.web.desc'](),
      href: '/online',
    },
  ];
  return (
    <section id="platforms" className={section}>
      <div className={container}>
        <Reveal>
          <SectionHeading title={m['fc.home.platforms.title']()} />
        </Reveal>
        <div className="bg-border mt-12 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 70} className="bg-background">
              <Link
                href={it.href}
                className="group hover:bg-accent flex h-full flex-col p-7 transition-colors"
              >
                <h3 className="font-title text-lg">{it.title}</h3>
                <p className="text-muted-foreground mt-3 flex-1 leading-relaxed">
                  {it.desc}
                </p>
                <ArrowRight className="text-primary mt-6 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareTeaser() {
  return (
    <section id="compare" className={section}>
      <div className={container}>
        <Reveal>
          <SectionHeading title={m['fc.home.compare.title']()} />
        </Reveal>
        <Reveal delay={100}>
          <CompareTable
            className="mt-12"
            columns={compareColumns()}
            rows={compareRows(true)}
          />
          <Link
            href="/filmcraft-vs-premiere-pro"
            className="text-primary mt-6 inline-flex items-center gap-2 font-medium hover:underline"
          >
            {m['fc.home.compare.cta']()}
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Guides() {
  const guides = [
    {
      href: '/download',
      title: m['fc.home.paths.download.title'](),
      desc: m['fc.home.paths.download.desc'](),
    },
    {
      href: '/online',
      title: m['fc.home.paths.online.title'](),
      desc: m['fc.home.paths.online.desc'](),
    },
    {
      href: '/tutorial',
      title: m['fc.home.paths.tutorial.title'](),
      desc: m['fc.home.paths.tutorial.desc'](),
    },
    {
      href: '/filmcraft-vs-premiere-pro',
      title: m['fc.home.paths.compare.title'](),
      desc: m['fc.home.paths.compare.desc'](),
    },
  ];
  return (
    <section id="guides" className={section}>
      <div className={container}>
        <Reveal>
          <SectionHeading title={m['fc.home.paths.title']()} />
        </Reveal>
        <ul className="border-border mt-10 border-t">
          {guides.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group border-border grid gap-2 border-b py-7 sm:grid-cols-[1.1fr_1fr_auto] sm:items-center sm:gap-10"
              >
                <span className="font-title group-hover:text-primary text-2xl transition-colors sm:text-3xl">
                  {g.title}
                </span>
                <span className="text-muted-foreground leading-relaxed">
                  {g.desc}
                </span>
                <ArrowUpRight className="text-muted-foreground group-hover:text-primary hidden size-5 transition-colors sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    [m['fc.home.faq.q1'](), m['fc.home.faq.a1']()],
    [m['fc.home.faq.q7'](), m['fc.home.faq.a7']()],
    [m['fc.home.faq.q2'](), m['fc.home.faq.a2']()],
    [m['fc.home.faq.q8'](), m['fc.home.faq.a8']()],
    [m['fc.home.faq.q3'](), m['fc.home.faq.a3']()],
    [m['fc.home.faq.q4'](), m['fc.home.faq.a4']()],
    [m['fc.home.faq.q9'](), m['fc.home.faq.a9']()],
    [m['fc.home.faq.q6'](), m['fc.home.faq.a6']()],
  ];
  return (
    <section id="faq" className={section}>
      <div
        className={cn(
          container,
          'grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-20'
        )}
      >
        <Reveal>
          <SectionHeading title={m['fc.home.faq.title']()} />
        </Reveal>
        <Reveal delay={100}>
          <div className="border-border border-t">
            {faqs.map(([q, a]) => (
              <details key={q} className="group border-border border-b">
                <summary className="focus-visible:outline-ring flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[17px] font-medium focus-visible:outline-2 [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown
                    aria-hidden
                    className="size-4 shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="text-muted-foreground pb-5 text-base leading-relaxed">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(([q, a]) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="px-4 pt-8 pb-24 sm:px-6 sm:pb-32">
      <Reveal className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[10px]">
        <img
          src={filmcraftImages.keyframes}
          srcSet={filmcraftImageSrcSet(filmcraftImages.keyframes)}
          sizes="(min-width: 1024px) 800px, calc(100vw - 32px)"
          alt=""
          aria-hidden
          width={1600}
          height={1000}
          loading="lazy"
          fetchPriority="low"
          className="absolute inset-0 -z-10 size-full object-cover opacity-30"
        />
        <div className="bg-background/85 absolute inset-0 -z-10" />
        <div className="px-6 py-20 sm:px-16 sm:py-28">
          <h2 className="font-title max-w-2xl text-4xl leading-[1.05] text-balance sm:text-[3.4rem]">
            {m['fc.home.cta.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 max-w-lg text-lg">
            {m['fc.home.cta.subtitle']()}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/download" className={pillPrimary}>
              <Download className="size-4" />
              {m['fc.home.hero.cta_download']()}
            </Link>
            <a
              href={filmcraftLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className={pillGhost}
            >
              {m['fc.footer.github']()}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function FilmCraftHome({ version }: { version: string }) {
  return (
    <>
      <Hero />
      <WhatIs version={version} />
      <Features />
      <Review />
      <ArtCraft />
      <Platforms />
      <CompareTeaser />
      <Guides />
      <Faq />
      <FinalCta />
    </>
  );
}
