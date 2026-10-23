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
      // The guide has no public accounts; signing in is for the site admin,
      // so land on the admin panel (non-admins are refused by its APIs).
      signIn={{
        href: '/sign-in?callbackUrl=/admin',
        label: m['common.nav.sign_in'](),
      }}
    />
  );
}
