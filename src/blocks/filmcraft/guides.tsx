import { Suspense } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { filmcraftImageSrcSet } from '@/config/filmcraft';
import { m } from '@/paraglide/messages.js';
import { guideMdxComponents } from '@/components/filmcraft/guide-content';
import { SectionHeading } from '@/components/filmcraft/section-heading';
import {
  getGuideBody,
  getGuides,
  getRelatedGuides,
  type Guide,
} from '@/content/guides';

export function FeaturedGuides({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const CardHeading = standalone ? 'h2' : 'h3';
  const guides = standalone ? getGuides() : getGuides().slice(0, 4);
  return (
    <section id="editing-guides" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            as={standalone ? 'h1' : 'h2'}
            label={m['fc.guides.eyebrow']()}
            title={m['fc.guides.title']()}
            description={m['fc.guides.description']()}
          />
          {!standalone && (
            <Link
              href="/guides"
              className="text-primary inline-flex items-center gap-2 text-sm underline underline-offset-4"
            >
              {m['fc.guides.view_all']()}
              <ArrowUpRight className="size-4" />
            </Link>
          )}
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {guides.map((guide, index) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group border-border border-b pb-7"
            >
              <div className="bg-card overflow-hidden rounded-lg">
                <img
                  src={guide.image}
                  srcSet={
                    guide.image.startsWith('/imgs/filmcraft/')
                      ? filmcraftImageSrcSet(guide.image)
                      : undefined
                  }
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                  alt={guide.imageAlt}
                  width={1200}
                  height={750}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <p className="font-tc text-muted-foreground mt-5 text-xs">
                {String(index + 1).padStart(2, '0')} / {guide.category} ·{' '}
                {m['fc.guides.read_time']({ minutes: guide.minutes })}
              </p>
              <CardHeading className="font-title group-hover:text-primary mt-3 text-2xl leading-tight transition-colors">
                {guide.title}
              </CardHeading>
              <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">
                {guide.description}
              </p>
              <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-medium">
                {m['fc.guides.read']()}
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FilmcraftGuide({ guide }: { guide: Guide }) {
  const Body = getGuideBody(guide.slug);
  return (
    <article className="px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label={m['fc.guides.breadcrumb']()}
          className="text-muted-foreground flex flex-wrap gap-2 text-sm"
        >
          <Link href="/" className="hover:text-primary">
            {m['fc.guides.home']()}
          </Link>
          <span aria-hidden>/</span>
          <Link href="/guides" className="hover:text-primary">
            {m['fc.guides.nav']()}
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{guide.category}</span>
        </nav>
        <header className="border-border mt-10 border-b pb-10 sm:pb-14">
          <p className="font-tc text-primary text-xs">
            {guide.category} ·{' '}
            {m['fc.guides.read_time']({ minutes: guide.minutes })}
          </p>
          <h1 className="font-title mt-5 max-w-4xl text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
            {guide.title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">
            {guide.description}
          </p>
          <p className="text-muted-foreground mt-6 text-sm">
            {envConfigs.app_name} · {m['fc.guides.updated']()}{' '}
            <time dateTime={guide.updatedAt}>{guide.updatedAt}</time>
          </p>
        </header>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav
            aria-label={m['fc.guides.contents']()}
            className="border-border rounded-lg border p-5 lg:sticky lg:top-28 lg:border-0 lg:p-0"
          >
            <p className="font-tc text-muted-foreground text-xs">
              {m['fc.guides.contents']()}
            </p>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed">
              {guide.toc.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary flex gap-3"
                  >
                    <span className="font-tc text-xs leading-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-[800px] min-w-0">
            <div className="text-foreground/90 text-base sm:text-[17px]">
              <MDXProvider components={guideMdxComponents}>
                <Suspense fallback={<p>{m['fc.guides.loading']()}</p>}>
                  <Body />
                </Suspense>
              </MDXProvider>
            </div>
            <aside className="border-border mt-14 border-t pt-8">
              <h2 className="font-title text-2xl">{m['fc.guides.next']()}</h2>
              <ul className="divide-border mt-5 divide-y">
                {getRelatedGuides(guide).map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/guides/${item.slug}`}
                      className="hover:text-primary flex items-center justify-between gap-4 py-4"
                    >
                      {item.title}
                      <ArrowUpRight className="size-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="text-primary mt-8 inline-flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="size-4" />
                {m['fc.guides.back_home']()}
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}
