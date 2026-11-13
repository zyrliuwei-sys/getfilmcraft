import { lazy, type ComponentType } from 'react';

export const GUIDE_SLUGS = [
  'filmcraft-tutorial-first-video',
  'filmcraft-online-edit-save-export',
  'filmcraft-web-setup-troubleshooting',
  'filmcraft-shortcuts',
  'filmcraft-premiere-shortcuts',
  'filmcraft-export-settings',
  'filmcraft-proxy-workflow',
  'filmcraft-relink-offline-media',
  'filmcraft-multicam-audio-sync',
  'filmcraft-subtitles-srt',
  'filmcraft-color-management-scopes',
  'filmcraft-keyframe-animation',
  'filmcraft-audio-cleanup',
  'filmcraft-vertical-video',
  'filmcraft-linux-installation',
  'filmcraft-vs-davinci-resolve',
] as const;

export const GUIDE_PUBLISHED_AT = '2026-11-05';

export type GuideMeta = {
  title: string;
  description: string;
  category: string;
  minutes: number;
  image: string;
  socialImage?: string;
  imageAlt: string;
  publishedAt?: string;
  updatedAt?: string;
  related?: string[];
  toc: { id: string; title: string }[];
};
export type Guide = GuideMeta & {
  slug: string;
  publishedAt: string;
  updatedAt: string;
};

// Only metadata is eager. Article bodies stay in individual route chunks.
const metas = import.meta.glob<GuideMeta>('./*.en.mdx', {
  eager: true,
  import: 'meta',
});
const bodies = import.meta.glob<ComponentType>('./*.en.mdx', {
  import: 'default',
});

export function getGuide(slug: string): Guide | null {
  if (!GUIDE_SLUGS.includes(slug as (typeof GUIDE_SLUGS)[number])) return null;
  const meta = metas[`./${slug}.en.mdx`];
  return meta
    ? {
        ...meta,
        slug,
        publishedAt: meta.publishedAt ?? GUIDE_PUBLISHED_AT,
        updatedAt: meta.updatedAt ?? meta.publishedAt ?? GUIDE_PUBLISHED_AT,
      }
    : null;
}

export function getRelatedGuides(guide: Guide): Guide[] {
  const related = (guide.related ?? []).flatMap((slug) => {
    const item = getGuide(slug);
    return item ? [item] : [];
  });
  return [...related, ...getGuides()]
    .filter(
      (item, index, all) =>
        item.slug !== guide.slug &&
        all.findIndex((other) => other.slug === item.slug) === index
    )
    .slice(0, 3);
}

export function getGuides(): Guide[] {
  return GUIDE_SLUGS.flatMap((slug) => {
    const guide = getGuide(slug);
    return guide ? [guide] : [];
  });
}

const components = new Map<string, ComponentType>();
export function getGuideBody(slug: string): ComponentType {
  let Body = components.get(slug);
  if (!Body) {
    Body = lazy(async () => ({ default: await bodies[`./${slug}.en.mdx`]() }));
    components.set(slug, Body);
  }
  return Body;
}
