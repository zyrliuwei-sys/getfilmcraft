import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from 'react';
import type { MDXComponents } from 'mdx/types';

import { Link } from '@/core/i18n/navigation';
import { filmcraftImageSrcSet } from '@/config/filmcraft';
import { mdxComponents } from '@/components/mdx-components';

export function GuideHeading({
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className="font-title text-foreground mt-14 mb-5 scroll-mt-28 text-2xl leading-tight sm:text-3xl"
    >
      {children}
    </h2>
  );
}

export function GuideTable({ children }: { children: ReactNode }) {
  return (
    <div className="border-border my-7 overflow-x-auto rounded-lg border">
      <table className="[&_th]:bg-card [&_th]:text-foreground [&_tr]:border-border w-full min-w-[540px] border-collapse text-left text-sm leading-relaxed [overflow-wrap:normal] [&_tbody_tr:last-child]:border-0 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_tr]:border-b">
        {children}
      </table>
    </div>
  );
}

export function GuideFigure({
  src,
  alt,
  children,
  height = 750,
}: {
  src: string;
  alt: string;
  children: ReactNode;
  height?: number;
}) {
  return (
    <figure className="my-9">
      <a href={src} target="_blank" rel="noopener noreferrer" aria-label={alt}>
        <img
          src={src}
          srcSet={
            src.startsWith('/imgs/filmcraft/')
              ? filmcraftImageSrcSet(src)
              : undefined
          }
          sizes="(min-width: 1024px) 800px, calc(100vw - 32px)"
          alt={alt}
          width={src.startsWith('/imgs/filmcraft/') ? 1600 : 1200}
          height={src.startsWith('/imgs/filmcraft/') ? 1000 : height}
          loading="lazy"
          decoding="async"
          className="border-border w-full rounded-lg border"
        />
      </a>
      <figcaption className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {children}
      </figcaption>
    </figure>
  );
}

function GuideLink({
  href = '',
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const className =
    'text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary';
  return href.startsWith('/') && !href.startsWith('//') ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a {...props} href={href} className={className}>
      {children}
    </a>
  );
}

export const guideMdxComponents: MDXComponents = {
  ...mdxComponents,
  a: GuideLink,
  h2: GuideHeading,
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className="font-title text-foreground mt-8 mb-3 scroll-mt-28 text-xl"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-4 leading-8">{children}</p>,
  li: ({ children }) => <li className="my-2 pl-1 leading-8">{children}</li>,
  table: GuideTable,
  th: ({ children }) => (
    <th className="bg-card text-foreground border-border border-b px-4 py-3 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-border border-b px-4 py-3 align-top">{children}</td>
  ),
  pre: ({ children }) => (
    <pre className="bg-card my-6 overflow-x-auto rounded-lg p-5 text-sm leading-7 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      {...props}
      loading="lazy"
      decoding="async"
      className="my-7 h-auto max-w-full rounded-lg"
    />
  ),
};
