import { createFileRoute } from '@tanstack/react-router';

import { pageHead } from '@/lib/page-head';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { FeaturedGuides } from '@/blocks/filmcraft/guides';
import { PageShell } from '@/blocks/filmcraft/page-shell';

export const Route = createFileRoute('/guides/')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) =>
    pageHead({
      title: m['fc.guides.meta.title']({}, { locale: loaderData?.locale }),
      description: m['fc.guides.description'](
        {},
        { locale: loaderData?.locale }
      ),
      path: '/guides',
      locale: loaderData?.locale ?? 'en',
    }),
  component: () => (
    <PageShell>
      <FeaturedGuides standalone />
    </PageShell>
  ),
});
