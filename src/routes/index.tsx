import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import {
  filmcraftImages,
  filmcraftImageSrcSet,
  filmcraftLinks,
} from '@/config/filmcraft';
import { getFilmcraftRelease } from '@/lib/filmcraft-release';
import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { FilmCraftHome } from '@/blocks/filmcraft/home';
import { PageShell } from '@/blocks/filmcraft/page-shell';

export const Route = createFileRoute('/')({
  loader: async () => ({
    locale: getLocale(),
    release: await getFilmcraftRelease(),
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const title = m['common.metadata.title']({}, { locale });
    const description = m['common.metadata.description']({}, { locale });
    const head = pageHead({ title, description, path: '', locale });
    return {
      ...head,
      links: [
        ...head.links,
        {
          rel: 'preload',
          as: 'image',
          href: filmcraftImages.hero,
          imageSrcSet: filmcraftImageSrcSet(filmcraftImages.hero),
          imageSizes: '(min-width: 1280px) 1280px, calc(100vw - 32px)',
          fetchPriority: 'high',
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: envConfigs.app_name,
            url: envConfigs.app_url,
            description,
            inLanguage: locale,
            about: {
              '@type': 'SoftwareApplication',
              name: 'FilmCraft',
              applicationCategory: 'MultimediaApplication',
              url: filmcraftLinks.official,
            },
          }).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { release } = Route.useLoaderData();
  return (
    <PageShell>
      <FilmCraftHome version={release.version} />
    </PageShell>
  );
}
