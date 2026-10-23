import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface CompareRow {
  label: string;
  filmcraft: string;
  premiere: string;
  /** Which side this row favors; marked with a check. */
  edge?: 'filmcraft' | 'premiere';
}

function Cell({
  text,
  wins,
  dim,
}: {
  text: string;
  wins: boolean;
  dim?: boolean;
}) {
  return (
    <span
      className={cn('flex gap-2.5', dim && !wins && 'text-muted-foreground')}
    >
      <Check
        aria-hidden
        className={cn(
          'mt-[3px] size-4 shrink-0',
          wins ? 'text-primary' : 'invisible'
        )}
      />
      {text}
    </span>
  );
}

export function CompareTable({
  columns,
  rows,
  className,
}: {
  columns: { feature: string; filmcraft: string; premiere: string };
  rows: CompareRow[];
  className?: string;
}) {
  return (
    <div className={cn('bg-card overflow-hidden rounded-lg', className)}>
      {/* Phones: one stacked block per row so both columns stay visible. */}
      <dl className="sm:hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={cn('space-y-3 px-5 py-4', i % 2 === 1 && 'bg-muted/50')}
          >
            <dt className="font-tc text-muted-foreground text-xs">
              {row.label}
            </dt>
            <dd className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1 text-xs">
                  {columns.filmcraft}
                </p>
                <p className={cn(row.edge === 'filmcraft' && 'text-primary')}>
                  {row.filmcraft}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs">
                  {columns.premiere}
                </p>
                <p
                  className={cn(
                    row.edge === 'premiere'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {row.premiere}
                </p>
              </div>
            </dd>
          </div>
        ))}
      </dl>
      <table className="hidden w-full text-left text-[15px] sm:table">
        <thead>
          <tr className="border-border border-b">
            <th className="font-tc text-muted-foreground w-[22%] px-6 py-4 text-xs font-normal">
              {columns.feature}
            </th>
            <th className="font-title w-[39%] px-6 py-4 text-base">
              {columns.filmcraft}
            </th>
            <th className="font-title text-muted-foreground w-[39%] px-6 py-4 text-base">
              {columns.premiere}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={cn(i % 2 === 1 && 'bg-muted/50')}>
              <th
                scope="row"
                className="text-muted-foreground px-6 py-4 align-top font-normal"
              >
                {row.label}
              </th>
              <td className="px-6 py-4 align-top">
                <Cell text={row.filmcraft} wins={row.edge === 'filmcraft'} />
              </td>
              <td className="px-6 py-4 align-top">
                <Cell text={row.premiere} wins={row.edge === 'premiere'} dim />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
