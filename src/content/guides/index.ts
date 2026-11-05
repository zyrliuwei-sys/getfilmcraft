import { lazy, type ComponentType } from 'react';

export const GUIDE_SLUGS = [
  'filmcraft-tutorial-first-video',
  'filmcraft-online-edit-save-export',
  'filmcraft-web-setup-troubleshooting',
  'filmcraft-shortcuts',
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
  toc: { id: string; title: string }[];
};
export type Guide = GuideMeta & { slug: string };

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
  return meta ? { ...meta, slug } : null;
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
