import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';
import { LocaleSelector } from '@/components/locale-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';

export interface NavLink {
  href: string;
  label: string;
  /** Open in a new tab. Off-site (http) hrefs always open in a new tab. */
  external?: boolean;
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export function SiteHeader({
  navLinks,
  logoAlt,
  cta,
  signIn,
  menuLabels,
}: {
  navLinks?: NavLink[];
  logoAlt: string;
  cta: { href: string; label: string };
  signIn?: { href: string; label: string };
  menuLabels: { open: string; close: string };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background/70 border-border sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src={envConfigs.app_logo}
            alt={logoAlt}
            width={512}
            height={512}
            className="size-7 rounded-lg"
          />
          <span className="text-base font-semibold tracking-[-0.03em]">
            {envConfigs.app_name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 xl:flex">
          {navLinks?.map((link) =>
            isExternalHref(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex min-h-10 items-center text-sm transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                className="text-muted-foreground hover:text-foreground inline-flex min-h-10 items-center text-sm transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 xl:flex">
          <LocaleSelector />
          <ThemeToggle />
          {signIn && (
            <Link
              href={signIn.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'rounded-full px-4'
              )}
            >
              {signIn.label}
            </Link>
          )}
          <Link
            href={cta.href}
            className={cn(buttonVariants(), 'gap-1.5 rounded-full px-4')}
          >
            {cta.label}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-md focus-visible:ring-2 xl:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? menuLabels.close : menuLabels.open}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-border border-t px-4 pt-2 pb-4 xl:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks?.map((link) =>
              isExternalHref(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex min-h-11 items-center rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex min-h-11 items-center rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="border-border mt-3 flex items-center gap-2 border-t pt-3">
            <LocaleSelector />
            <ThemeToggle />
            <div className="flex-1" />
            {signIn && (
              <Link
                href={signIn.href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'min-h-11 rounded-full px-4'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {signIn.label}
              </Link>
            )}
            <Link
              href={cta.href}
              className={cn(buttonVariants(), 'gap-1.5 rounded-full px-4')}
              onClick={() => setMobileOpen(false)}
            >
              {cta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
