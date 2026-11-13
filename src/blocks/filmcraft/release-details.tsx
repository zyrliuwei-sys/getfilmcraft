import { releaseLinks, type FilmcraftRelease } from '@/config/filmcraft';
import { m } from '@/paraglide/messages.js';

export function ReleaseDetails({ release }: { release: FilmcraftRelease }) {
  const date = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(release.publishedAt));
  return (
    <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
      <time dateTime={release.publishedAt}>
        {m['fc.release.published']({ date })}
      </time>
      {' · '}
      <a
        className="text-primary underline underline-offset-4"
        href={releaseLinks(release.version).releaseNotes}
      >
        {m['fc.release.notes']()}
      </a>
      {release.source !== 'github' && (
        <span className="mt-1 block">{m['fc.release.snapshot']()}</span>
      )}
    </p>
  );
}
