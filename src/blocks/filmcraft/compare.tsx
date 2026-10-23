import { Check } from 'lucide-react';

import { m } from '@/paraglide/messages.js';
import { CompareTable } from '@/components/filmcraft/compare-table';
import { Reveal } from '@/components/filmcraft/reveal';

import { compareColumns, compareRows } from './compare-rows';
import { FinalCta } from './home';
import { PageIntro } from './page-shell';

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((it) => (
        <li
          key={it}
          className="text-muted-foreground flex gap-3 leading-relaxed"
        >
          <Check className="text-primary mt-1 size-4 shrink-0" />
          {it}
        </li>
      ))}
    </ul>
  );
}

export function CompareGuide({ version }: { version: string }) {
  const fcWins = [
    m['fc.vs.fc_wins.1'](),
    m['fc.vs.fc_wins.2'](),
    m['fc.vs.fc_wins.3'](),
    m['fc.vs.fc_wins.4'](),
    m['fc.vs.fc_wins.5'](),
    m['fc.vs.fc_wins.6'](),
  ];
  const prWins = [
    m['fc.vs.pr_wins.1'](),
    m['fc.vs.pr_wins.2'](),
    m['fc.vs.pr_wins.3'](),
    m['fc.vs.pr_wins.4'](),
    m['fc.vs.pr_wins.5'](),
    m['fc.vs.pr_wins.6'](),
  ];
  const whoFc = [
    m['fc.vs.who.fc.1'](),
    m['fc.vs.who.fc.2'](),
    m['fc.vs.who.fc.3'](),
    m['fc.vs.who.fc.4'](),
  ];
  const whoPr = [
    m['fc.vs.who.pr.1'](),
    m['fc.vs.who.pr.2'](),
    m['fc.vs.who.pr.3'](),
    m['fc.vs.who.pr.4'](),
  ];
  const switching = [
    m['fc.vs.switch.1'](),
    m['fc.vs.switch.2'](),
    m['fc.vs.switch.3'](),
    m['fc.vs.switch.4'](),
  ];

  return (
    <>
      <PageIntro
        label={`${m['fc.vs.label']()} · ${m['fc.common.updated']()}`}
        title={m['fc.vs.title']()}
        description={m['fc.vs.subtitle']()}
      />
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-6xl space-y-20">
          <Reveal>
            <h2 className="font-title text-2xl sm:text-3xl">
              {m['fc.vs.table.title']()}
            </h2>
            <CompareTable
              className="mt-6"
              columns={compareColumns()}
              rows={compareRows()}
            />
            <p className="text-muted-foreground mt-3 text-xs">
              {m['fc.vs.table.note']({ version })}
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal className="bg-card rounded-lg p-7 sm:p-8">
              <h2 className="font-title text-2xl">
                {m['fc.vs.fc_wins.title']()}
              </h2>
              <CheckList items={fcWins} />
            </Reveal>
            <Reveal delay={80} className="bg-card rounded-lg p-7 sm:p-8">
              <h2 className="font-title text-2xl">
                {m['fc.vs.pr_wins.title']()}
              </h2>
              <CheckList items={prWins} />
            </Reveal>
          </div>

          <Reveal>
            <h2 className="font-title text-3xl sm:text-5xl">
              {m['fc.vs.who.title']()}
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="font-title text-xl">
                  {m['fc.vs.who.fc.title']()}
                </h3>
                <CheckList items={whoFc} />
              </div>
              <div>
                <h3 className="font-title text-xl">
                  {m['fc.vs.who.pr.title']()}
                </h3>
                <CheckList items={whoPr} />
              </div>
            </div>
          </Reveal>

          <Reveal className="bg-card rounded-lg p-7 sm:p-8">
            <h2 className="font-title text-2xl">{m['fc.vs.switch.title']()}</h2>
            <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {switching.map((s, i) => (
                <li key={s}>
                  <span className="font-tc text-primary text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    {s}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="max-w-3xl">
            <h2 className="font-title text-3xl sm:text-5xl">
              {m['fc.vs.verdict.title']()}
            </h2>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
              {m['fc.vs.verdict.desc']()}
            </p>
          </Reveal>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
