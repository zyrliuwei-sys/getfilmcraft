import { createFileRoute } from '@tanstack/react-router';

import { ADS_TXT } from '@/config/adsense';

export const Route = createFileRoute('/ads.txt')({
  server: {
    handlers: {
      GET: () => {
        return new Response(ADS_TXT, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
