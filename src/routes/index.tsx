import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { filmcraftLinks } from '@/config/filmcraft';
import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { FilmCraftHome } from '@/blocks/filmcraft/home';
import { PageShell } from '@/blocks/filmcraft/page-shell';

export const Route = createFileRoute('/')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) => {
    const locale = (loaderData?.locale ?? 'en') as 'en';
    const title = m['common.metadata.title']({}, { locale });
    const description = m['common.metadata.description']({}, { locale });
    return {
      ...pageHead({ title, description, path: '', locale }),
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
  return (
    <PageShell>
      <FilmCraftHome />
    </PageShell>
  );
}
