import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { config, sortedAwards } from '@/lib/loadConfig';
import type { Award } from '@/types';

export function Awards() {
  const [showAll, setShowAll] = useState(false);
  const listRef = useStaggerAnimation<HTMLOListElement>();

  const maxVisible = config.awards?.maxVisible ?? sortedAwards.length;
  const visibleAwards = showAll
    ? sortedAwards
    : sortedAwards.slice(0, maxVisible);
  const hasMore = sortedAwards.length > maxVisible;

  return (
    <section
      id="awards"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          Awards
        </h2>
      </div>
      <div>
        <ol className="group/list" ref={listRef}>
          {visibleAwards.map((award) => (
            <AwardItem
              key={`${award.title}-${award.date}`}
              award={award}
            />
          ))}
        </ol>

        {hasMore && !showAll && (
          <div className="mt-12">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="w-full border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-300/50"
            >
              Show All Awards
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function AwardItem({ award }: { award: Award }) {
  return (
    <li className="mb-12">
      <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
        <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>

        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
          {formatAwardDate(award.date)}
        </header>

        <div className="z-10 sm:col-span-6">
          <h3 className="font-medium leading-snug text-slate-200">
            <span>{award.title}</span>
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {award.issuer}
          </p>
          <p className="mt-2 text-sm leading-normal text-slate-400">
            {award.description}
          </p>
          {award.details && (
            <p className="mt-2 text-sm leading-normal text-slate-400">
              {award.details}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

function formatAwardDate(value: string): string {
  if (!value) return '';
  const normalized = value.trim();
  if (normalized.toLowerCase() === 'present') return 'Present';

  const parts = normalized.split('-').filter(Boolean);
  const [year, month, day] = parts;
  const monthNum = month ? Number(month) : NaN;
  const dayNum = day ? Number(day) : NaN;
  const monthName =
    monthNum >= 1 && monthNum <= 12
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthNum - 1]
      : null;

  if (parts.length === 1 && /^\d{4}$/.test(year ?? '')) {
    return year as string;
  }

  if (parts.length === 2 && monthName) {
    return `${monthName} ${year}`;
  }

  if (parts.length >= 3 && monthName && !Number.isNaN(dayNum)) {
    return `${monthName} ${dayNum}, ${year}`;
  }

  const date = new Date(normalized);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  return normalized;
}
