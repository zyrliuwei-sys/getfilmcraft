import { m } from '@/paraglide/messages.js';
import type { CompareRow } from '@/components/filmcraft/compare-table';

export function compareColumns() {
  return {
    feature: m['fc.cmp.col.feature'](),
    filmcraft: m['fc.cmp.col.filmcraft'](),
    premiere: m['fc.cmp.col.premiere'](),
  };
}

/** FilmCraft vs Premiere Pro rows. `short` = the home-page teaser subset. */
export function compareRows(short = false): CompareRow[] {
  const all: (CompareRow & { teaser?: boolean })[] = [
    {
      label: m['fc.cmp.price.label'](),
      filmcraft: m['fc.cmp.price.fc'](),
      premiere: m['fc.cmp.price.pr'](),
      edge: 'filmcraft',
      teaser: true,
    },
    {
      label: m['fc.cmp.license.label'](),
      filmcraft: m['fc.cmp.license.fc'](),
      premiere: m['fc.cmp.license.pr'](),
      edge: 'filmcraft',
      teaser: true,
    },
    {
      label: m['fc.cmp.platforms.label'](),
      filmcraft: m['fc.cmp.platforms.fc'](),
      premiere: m['fc.cmp.platforms.pr'](),
      edge: 'filmcraft',
      teaser: true,
    },
    {
      label: m['fc.cmp.web.label'](),
      filmcraft: m['fc.cmp.web.fc'](),
      premiere: m['fc.cmp.web.pr'](),
      edge: 'filmcraft',
      teaser: true,
    },
    {
      label: m['fc.cmp.mobile.label'](),
      filmcraft: m['fc.cmp.mobile.fc'](),
      premiere: m['fc.cmp.mobile.pr'](),
      edge: 'premiere',
    },
    {
      label: m['fc.cmp.trial.label'](),
      filmcraft: m['fc.cmp.trial.fc'](),
      premiere: m['fc.cmp.trial.pr'](),
      edge: 'filmcraft',
    },
    {
      label: m['fc.cmp.editing.label'](),
      filmcraft: m['fc.cmp.editing.fc'](),
      premiere: m['fc.cmp.editing.pr'](),
    },
    {
      label: m['fc.cmp.color.label'](),
      filmcraft: m['fc.cmp.color.fc'](),
      premiere: m['fc.cmp.color.pr'](),
    },
    {
      label: m['fc.cmp.ai.label'](),
      filmcraft: m['fc.cmp.ai.fc'](),
      premiere: m['fc.cmp.ai.pr'](),
      edge: 'premiere',
      teaser: true,
    },
    {
      label: m['fc.cmp.codecs.label'](),
      filmcraft: m['fc.cmp.codecs.fc'](),
      premiere: m['fc.cmp.codecs.pr'](),
      edge: 'premiere',
    },
    {
      label: m['fc.cmp.interchange.label'](),
      filmcraft: m['fc.cmp.interchange.fc'](),
      premiere: m['fc.cmp.interchange.pr'](),
    },
    {
      label: m['fc.cmp.plugins.label'](),
      filmcraft: m['fc.cmp.plugins.fc'](),
      premiere: m['fc.cmp.plugins.pr'](),
      edge: 'premiere',
    },
    {
      label: m['fc.cmp.maturity.label'](),
      filmcraft: m['fc.cmp.maturity.fc'](),
      premiere: m['fc.cmp.maturity.pr'](),
      edge: 'premiere',
      teaser: true,
    },
  ];
  return short ? all.filter((r) => r.teaser) : all;
}
