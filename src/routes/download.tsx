import { createFileRoute } from '@tanstack/react-router';

import { FILMCRAFT_VERSION } from '@/config/filmcraft';
import { getFilmcraftRelease } from '@/lib/filmcraft-release';
import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { DownloadGuide } from '@/blocks/filmcraft/download';
import { PageShell } from '@/blocks/filmcraft/page-shell';

export const Route = createFileRoute('/download')({
  loader: async () => ({
    locale: getLocale(),
    release: await getFilmcraftRelease(),
  }),
  head: ({ loaderData }) => {
    const locale = (loaderData?.locale ?? 'en') as 'en';
    const version = loaderData?.release.version ?? FILMCRAFT_VERSION;
    return pageHead({
      title: m['fc.dl.meta.title']({ version }, { locale }),
      description: m['fc.dl.meta.description']({ version }, { locale }),
      path: '/download',
      locale,
    });
  },
  component: DownloadPage,
});

function DownloadPage() {
  const { release } = Route.useLoaderData();
  return (
    <PageShell>
      <DownloadGuide release={release} />
    </PageShell>
  );
}
