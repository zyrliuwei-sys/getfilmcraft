import { filmcraftLinks } from '@/config/filmcraft';
import { m } from '@/paraglide/messages.js';
import { FooterBadgeList } from '@/components/footer-badge-list';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: m['fc.footer.guide'](),
      links: [
        { label: m['fc.nav.download'](), href: '/download' },
        { label: m['fc.nav.online'](), href: '/online' },
        { label: m['fc.nav.tutorial'](), href: '/tutorial' },
        { label: m['fc.nav.compare'](), href: '/filmcraft-vs-premiere-pro' },
      ],
    },
    {
      title: m['fc.footer.official'](),
      links: [
        {
          label: m['fc.footer.official_page'](),
          href: filmcraftLinks.official,
        },
        { label: m['fc.footer.github'](), href: filmcraftLinks.github },
        { label: m['fc.footer.releases'](), href: filmcraftLinks.releases },
        { label: m['fc.footer.discord'](), href: filmcraftLinks.discord },
      ],
    },
    {
      title: m['fc.footer.legal'](),
      links: [
        { label: m['landing.footer.privacy'](), href: '/privacy-policy' },
        { label: m['landing.footer.terms'](), href: '/terms-of-service' },
        { label: m['landing.footer.aup'](), href: '/acceptable-use-policy' },
        {
          label: m['fc.footer.contact'](),
          href: `mailto:${m['fc.support.email']()}`,
        },
      ],
    },
  ];

  return (
    <SiteFooter
      tagline={m['fc.footer.tagline']()}
      columns={columns}
      badges={
        <>
          <p className="text-muted-foreground mt-12 max-w-3xl text-xs leading-relaxed">
            {m['fc.footer.disclaimer']()}
          </p>
          <FooterBadgeList className="mt-10" />
        </>
      }
    />
  );
}
