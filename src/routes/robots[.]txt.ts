import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const body = [
          'User-Agent: *',
          'Allow: /',
          'Disallow: /admin',
          'Disallow: /settings',
          'Disallow: /api/',
          'Disallow: /zh/admin',
          'Disallow: /zh/settings',
          'Disallow: /zh/api/',
          'Disallow: /sign-in',
          'Disallow: /sign-up',
          'Disallow: /auth-callback',
          'Disallow: /zh/sign-in',
          'Disallow: /zh/sign-up',
          'Disallow: /zh/auth-callback',
          'Disallow: /*?*',
          '',
          `Sitemap: ${envConfigs.app_url}/sitemap.xml`,
          '',
        ].join('\n');
        return new Response(body, {
          headers: { 'Content-Type': 'text/plain' },
        });
      },
    },
  },
});
