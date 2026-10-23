import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/download', label: m['fc.nav.download']() },
    { href: '/online', label: m['fc.nav.online']() },
    { href: '/tutorial', label: m['fc.nav.tutorial']() },
    { href: '/filmcraft-vs-premiere-pro', label: m['fc.nav.compare']() },
  ];

  return (
    <SiteHeader
      navLinks={navLinks}
      logoAlt={m['fc.logo_alt']()}
      cta={{ href: '/download', label: m['fc.nav.cta']() }}
    />
  );
}
