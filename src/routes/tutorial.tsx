import { createFileRoute } from '@tanstack/react-router';

import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { PageShell } from '@/blocks/filmcraft/page-shell';
import { TutorialGuide } from '@/blocks/filmcraft/tutorial';

export const Route = createFileRoute('/tutorial')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) => {
    const locale = (loaderData?.locale ?? 'en') as 'en';
    return pageHead({
      title: m['fc.tut.meta.title']({}, { locale }),
      description: m['fc.tut.meta.description']({}, { locale }),
      path: '/tutorial',
      locale,
    });
  },
  component: TutorialPage,
});

function TutorialPage() {
  return (
    <PageShell>
      <TutorialGuide />
    </PageShell>
  );
}
