import type { ReactNode } from 'react';

import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { SectionHeading } from '@/components/filmcraft/section-heading';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/** Top-of-page intro for the guide sub-pages. */
export function PageIntro({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          as="h1"
          label={label}
          title={title}
          description={description}
        />
        {children}
      </div>
    </section>
  );
}

/** Monospace command block. */
export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="font-tc bg-muted text-foreground mt-4 overflow-x-auto rounded-lg px-4 py-3 text-[13px] leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

/** Numbered step list shared by the guide pages. */
export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-4">
          <span className="font-tc text-primary w-6 shrink-0 pt-0.5 text-sm">
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="text-muted-foreground leading-relaxed">{s}</p>
        </li>
      ))}
    </ol>
  );
}

export const cardClass = 'bg-card min-w-0 rounded-lg p-7 sm:p-8';
