import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Fades its children up once they scroll into view. Server-rendered content
 * is visible by default (no blank page before hydration / for crawlers);
 * only elements still below the fold at mount are hidden and animated in.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setState('hidden');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={state === 'shown' ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        state !== 'static' && 'transition-all duration-700 ease-out',
        state === 'hidden' && 'translate-y-6 opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
