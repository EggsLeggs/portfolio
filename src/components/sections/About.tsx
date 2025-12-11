import { config, getStats } from '@/lib/loadConfig';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function About() {
  const ref = useScrollAnimation();
  const stats = getStats();

  return (
    <section id="about" className="mb-8 scroll-mt-16 md:mb-12 lg:mb-16 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          About
        </h2>
      </div>
      <div ref={ref}>
        <p className="mb-4 text-slate-400 leading-relaxed">
          {config.about}
        </p>
        <StatsDisplay stats={stats} />
      </div>
    </section>
  );
}

function StatsDisplay({ stats }: { stats: { certifications: number; hackathonWins: number; projects: number } }) {
  return (
    <div className="mt-8 flex items-center justify-center py-8">
      {/* Stats */}
      <div className="flex items-start w-full max-w-2xl px-6 py-4 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
        <StatItem label="Certs" value={stats.certifications} />
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent self-stretch mt-0"></div>
        <StatItem label="Hackathon Wins" value={stats.hackathonWins} />
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent self-stretch mt-0"></div>
        <StatItem label="Projects" value={stats.projects} />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center flex-1 flex flex-col items-center">
      <div className="text-3xl font-bold text-slate-100 bg-gradient-to-b from-slate-100 to-slate-300 bg-clip-text text-transparent leading-none">
        {value}
      </div>
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1.5 leading-tight">{label}</div>
    </div>
  );
}
