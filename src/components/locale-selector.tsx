import { ChevronDown, Globe, Languages } from 'lucide-react';

import { localeNames } from '@/config/locale';
import { cn } from '@/lib/utils';
import { getLocale, locales, setLocale } from '@/paraglide/runtime.js';

/** Native selection avoids a menu runtime and works well on touch devices. */
export function LocaleSelector({
  variant = 'icon',
  className,
}: {
  variant?: 'icon' | 'pill';
  className?: string;
}) {
  const locale = getLocale();
  return (
    <label
      className={cn(
        'focus-within:ring-ring relative inline-flex items-center transition-colors focus-within:ring-2',
        variant === 'icon'
          ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground size-10 justify-center rounded-md'
          : 'h-10 gap-2 rounded-full border px-4 text-sm',
        className
      )}
    >
      {variant === 'icon' ? (
        <Languages aria-hidden className="size-4" />
      ) : (
        <>
          <Globe aria-hidden className="size-4" />
          <span>{localeNames[locale] || locale}</span>
          <ChevronDown aria-hidden className="size-4 opacity-70" />
        </>
      )}
      <select
        aria-label="Switch language"
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {localeNames[value] || value}
          </option>
        ))}
      </select>
    </label>
  );
}
