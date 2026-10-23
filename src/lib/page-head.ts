import { envConfigs } from '@/config';
import { locales, localizeUrl } from '@/paraglide/runtime.js';

type Locale = (typeof locales)[number];

/**
 * Route `head` for a public, indexable page: title/description, Open Graph,
 * canonical + hreflang alternates for every locale.
 */
export function pageHead({
  title,
  description,
  path,
  locale,
  image = '/imgs/filmcraft/hero.webp',
}: {
  title: string;
  description: string;
  /** Locale-free path, e.g. '/download' ('' for home). */
  path: string;
  locale: string;
  image?: string;
}) {
  const urlFor = (loc: string) =>
    localizeUrl(`${envConfigs.app_url}${path || '/'}`, {
      locale: loc as Locale,
    }).href;
  const imageUrl = `${envConfigs.app_url}${image}`;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: urlFor(locale) },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:alt', content: title },
      { property: 'og:site_name', content: envConfigs.app_name },
      { property: 'og:locale', content: locale === 'zh' ? 'zh_CN' : 'en_US' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: urlFor(locale) },
      ...locales.map((loc) => ({
        rel: 'alternate',
        hrefLang: loc,
        href: urlFor(loc),
      })),
      { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
    ],
  };
}
