import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Optional plain label + wide title-card heading + optional body. */
export function SectionHeading({
  label,
  title,
  description,
  as: Tag = 'h2',
  className,
}: {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl space-y-5', className)}>
      {label && <p className="text-primary text-sm font-medium">{label}</p>}
      <Tag
        className={cn(
          'font-title text-balance',
          Tag === 'h1'
            ? 'text-4xl leading-[1.05] sm:text-6xl'
            : 'text-3xl leading-[1.1] sm:text-[2.6rem]'
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
