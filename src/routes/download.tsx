import { createFileRoute } from '@tanstack/react-router';

import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { DownloadGuide } from '@/blocks/filmcraft/download';
import { PageShell } from '@/blocks/filmcraft/page-shell';

export const Route = createFileRoute('/download')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) => {
    const locale = (loaderData?.locale ?? 'en') as 'en';
    return pageHead({
      title: m['fc.dl.meta.title']({}, { locale }),
      description: m['fc.dl.meta.description']({}, { locale }),
      path: '/download',
      locale,
    });
  },
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <PageShell>
      <DownloadGuide />
    </PageShell>
  );
}
