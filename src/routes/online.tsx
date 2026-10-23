import { createFileRoute } from '@tanstack/react-router';

import { getFilmcraftRelease } from '@/lib/filmcraft-release';
import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { OnlineGuide } from '@/blocks/filmcraft/online';
import { PageShell } from '@/blocks/filmcraft/page-shell';

export const Route = createFileRoute('/online')({
  loader: async () => ({
    locale: getLocale(),
    release: await getFilmcraftRelease(),
  }),
  head: ({ loaderData }) => {
    const locale = (loaderData?.locale ?? 'en') as 'en';
    return pageHead({
      title: m['fc.online.meta.title']({}, { locale }),
      description: m['fc.online.meta.description']({}, { locale }),
      path: '/online',
      locale,
    });
  },
  component: OnlinePage,
});

function OnlinePage() {
  const { release } = Route.useLoaderData();
  return (
    <PageShell>
      <OnlineGuide version={release.version} />
    </PageShell>
  );
}
