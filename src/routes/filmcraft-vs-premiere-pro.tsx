import { createFileRoute } from '@tanstack/react-router';

import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { CompareGuide } from '@/blocks/filmcraft/compare';
import { PageShell } from '@/blocks/filmcraft/page-shell';

export const Route = createFileRoute('/filmcraft-vs-premiere-pro')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) => {
    const locale = (loaderData?.locale ?? 'en') as 'en';
    return pageHead({
      title: m['fc.vs.meta.title']({}, { locale }),
      description: m['fc.vs.meta.description']({}, { locale }),
      path: '/filmcraft-vs-premiere-pro',
      locale,
    });
  },
  component: ComparePage,
});

function ComparePage() {
  return (
    <PageShell>
      <CompareGuide />
    </PageShell>
  );
}
