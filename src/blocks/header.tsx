import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/download', label: m['fc.nav.download']() },
    { href: '/online', label: m['fc.nav.online']() },
    { href: '/tutorial', label: m['fc.nav.tutorial']() },
    { href: '/guides', label: m['fc.guides.nav']() },
    { href: '/filmcraft-vs-premiere-pro', label: m['fc.nav.compare']() },
    { href: '/about', label: m['fc.nav.about']() },
    { href: '/contact', label: m['fc.nav.contact']() },
  ];

  return (
    <SiteHeader
      navLinks={navLinks}
      logoAlt={m['fc.logo_alt']()}
      signIn={{ href: '/admin', label: m['common.sign.sign_in_title']() }}
      cta={{ href: '/download', label: m['fc.nav.cta']() }}
      menuLabels={{
        open: m['fc.nav.menu_open'](),
        close: m['fc.nav.menu_close'](),
      }}
    />
  );
}
