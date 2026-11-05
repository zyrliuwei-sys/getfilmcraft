import { createFileRoute, notFound } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';
import { FilmcraftGuide } from '@/blocks/filmcraft/guides';
import { PageShell } from '@/blocks/filmcraft/page-shell';
import { getGuide, GUIDE_PUBLISHED_AT } from '@/content/guides';

export const Route = createFileRoute('/guides/$slug')({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide, locale: getLocale() };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { guide, locale } = loaderData;
    const path = `/guides/${guide.slug}`;
    const head = pageHead({
      title: guide.title,
      description: guide.description,
      path,
      locale,
      image: guide.socialImage ?? guide.image,
    });
    const url = localizeUrl(`${envConfigs.app_url}${path}`, { locale }).href;
    return {
      ...head,
      meta: head.meta
        .map((item) =>
          'property' in item && item.property === 'og:type'
            ? { ...item, content: 'article' }
            : item
        )
        .concat([
          { property: 'article:published_time', content: GUIDE_PUBLISHED_AT },
          { property: 'article:modified_time', content: GUIDE_PUBLISHED_AT },
        ]),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Article',
                '@id': `${url}#article`,
                headline: guide.title,
                description: guide.description,
                mainEntityOfPage: url,
                image: `${envConfigs.app_url}${guide.socialImage ?? guide.image}`,
                inLanguage: locale,
                datePublished: GUIDE_PUBLISHED_AT,
                dateModified: GUIDE_PUBLISHED_AT,
                author: {
                  '@type': 'Organization',
                  name: envConfigs.app_name,
                  url: envConfigs.app_url,
                },
                publisher: {
                  '@type': 'Organization',
                  name: envConfigs.app_name,
                  url: envConfigs.app_url,
                },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: envConfigs.app_name,
                    item: `${envConfigs.app_url}/`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: m['fc.guides.nav']({}, { locale }),
                    item: `${envConfigs.app_url}/guides`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: guide.title,
                    item: url,
                  },
                ],
              },
            ],
          }).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  return (
    <PageShell>
      <FilmcraftGuide guide={guide} />
    </PageShell>
  );
}
