import { useState } from 'react';
import { sortedProjects, config, getProjectTag } from '@/lib/loadConfig';
import { Button } from '@/components/ui/button';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import type { Project } from '@/types';
import { DiscordLogo, FilePdf, GithubLogo, LinkSimple, Trophy } from '@phosphor-icons/react';

export function Projects() {
  const [showAll, setShowAll] = useState(false);
  const listRef = useStaggerAnimation<HTMLUListElement>();
  const maxVisible = config.projects.maxVisible;

  const visibleProjects = showAll ? sortedProjects : sortedProjects.slice(0, maxVisible);
  const hasMore = sortedProjects.length > maxVisible;

  return (
    <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          Projects
        </h2>
      </div>
      <div>
        <ul className="group/list" ref={listRef}>
          {visibleProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </ul>

        {hasMore && !showAll && (
          <div className="mt-12">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="w-full border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-300/50"
            >
              Show All Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="mb-12">
      <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
        <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>

        <div className="z-10 sm:col-span-8">
          <h3 className="font-medium leading-snug text-slate-200">
            <div className="inline-flex items-baseline font-medium leading-tight text-slate-200 group/link text-base">
              <span>
                {project.title}
                {project.featured && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-purple-600/10 px-2 py-1 text-xs font-medium text-purple-400">
                    Featured
                  </span>
                )}
              </span>
            </div>
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {formatProjectDateRange(project.date, project.endDate)}
          </p>

          <p className="mt-2 text-sm leading-normal text-slate-400">
            {project.description}
          </p>

          {project.award && (
            <div className="mt-2 inline-flex items-center rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
              <Trophy className="mr-1.5 h-4 w-4" weight="fill" aria-hidden="true" />
              {project.award}
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-4" aria-label="Project links">
              {project.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/link relative inline-flex items-center text-sm font-medium text-slate-400 hover:text-cyan-300 focus-visible:text-cyan-300"
                    aria-label={`${link.label} (opens in a new tab)`}
                  >
                    <LinkIcon icon={link.icon} />
                    <span className="ml-1">{link.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-0.5 inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {project.tags && project.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap" aria-label="Project tags">
              {project.tags.map((tagId) => {
                const tag = getProjectTag(tagId);
                if (!tag) return null;

                const colorClass = getTagColorClass(tag.color);

                return (
                  <li key={tagId} className="mr-1.5 mt-2">
                    <div className={`flex items-center rounded-full px-3 py-1 text-xs font-medium leading-5 ${colorClass}`}>
                      {tag.label}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
              {project.technologies.map((tech) => (
                <li key={tech} className="mr-1.5 mt-2">
                  <div className="flex items-center rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium leading-5 text-cyan-300">
                    {tech}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

function LinkIcon({ icon }: { icon: string }) {
  const IconComponent =
    icon === 'github' ? GithubLogo : icon === 'discord' ? DiscordLogo : icon === 'pdf' ? FilePdf : LinkSimple;

  return <IconComponent className="h-4 w-4" weight="bold" aria-hidden="true" />;
}

function formatProjectDateRange(start: string, end?: string): string {
  const formatDate = (value: unknown) => {
    if (!value) return '';
    const normalized = String(value).trim();
    if (normalized.toLowerCase() === 'present') return 'Present';

    const parts = normalized.split('-').filter(Boolean);
    const [year, month, day] = parts;

    // Year only (e.g., "2025")
    if (parts.length === 1 && /^\d{4}$/.test(year ?? '')) {
      return year as string;
    }

    const monthNum = month ? Number(month) : NaN;
    const dayNum = day ? Number(day) : NaN;
    const monthName =
      monthNum >= 1 && monthNum <= 12
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthNum - 1]
        : null;

    // Year + month (e.g., "2025-06")
    if (parts.length === 2 && monthName) {
      return `${monthName} ${year}`;
    }

    // Year + month + day (e.g., "2025-06-15")
    if (parts.length >= 3 && monthName && !Number.isNaN(dayNum)) {
      return `${monthName} ${dayNum}, ${year}`;
    }

    // Fallback to native parsing
    const date = new Date(normalized);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    return normalized;
  };

  const startFormatted = formatDate(start);
  const endFormatted = end ? formatDate(end) : '';

  if (!endFormatted || startFormatted === endFormatted) return startFormatted;
  return `${startFormatted} — ${endFormatted}`;
}

function getTagColorClass(color: string): string {
  switch (color) {
    case 'cyan':
      return 'bg-cyan-400/10 text-cyan-300';
    case 'purple':
      return 'bg-purple-600/10 text-purple-400';
    case 'blue':
      return 'bg-blue-400/10 text-blue-300';
    case 'green':
      return 'bg-green-400/10 text-green-300';
    case 'red':
      return 'bg-red-500/10 text-red-300';
    default:
      return 'bg-slate-400/10 text-slate-300';
  }
}
