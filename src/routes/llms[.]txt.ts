import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';

const STATIC_PAGES: { path: string; title: string; description: string }[] = [
  {
    path: '',
    title: 'GetFilmCraft video editing guides',
    description:
      'FilmCraft downloads, beginner tutorials, online editing options and comparisons',
  },
  {
    path: '/download',
    title: 'FilmCraft download guide',
    description: 'Official releases and installation instructions',
  },
  {
    path: '/online',
    title: 'FilmCraft online',
    description:
      'Browser access availability and self-hosted web build instructions',
  },
  {
    path: '/tutorial',
    title: 'FilmCraft beginner tutorial',
    description: 'Import, trim, arrange, add sound and export a video',
  },
  {
    path: '/filmcraft-vs-premiere-pro',
    title: 'FilmCraft vs Adobe Premiere Pro',
    description: 'Compare features, workflow, cost, strengths and limitations',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'Privacy information',
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service',
    description: 'Terms of use',
  },
  {
    path: '/acceptable-use-policy',
    title: 'Acceptable Use Policy',
    description:
      'Responsible use of the website, downloads and support channels',
  },
];

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const { app_url, app_name } = envConfigs;

        let posts: { slug: string; title: string; description: string }[] = [];
        try {
          const { listPublishedArticles } =
            await import('@/modules/posts/service');
          const rows = await listPublishedArticles().catch(() => []);
          posts = rows.map((row) => ({
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
          }));
        } catch {
          // Database unreachable — static project pages still listed.
        }

        const lines: string[] = [
          `# ${app_name}`,
          '',
          `> ${m['common.metadata.description']({}, { locale: 'en' })}`,
          '',
          '## Pages',
          '',
          ...STATIC_PAGES.map(
            (p) => `- [${p.title}](${app_url}${p.path}): ${p.description}`
          ),
        ];

        if (posts.length > 0) {
          lines.push('', '## Blog Posts', '');
          for (const post of posts) {
            lines.push(
              `- [${post.title}](${app_url}/blog/${post.slug}): ${post.description}`
            );
          }
        }

        lines.push('');

        return new Response(lines.join('\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
