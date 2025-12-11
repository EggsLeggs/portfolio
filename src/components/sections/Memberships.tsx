import { sortedMemberships } from '@/lib/loadConfig';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';

export function Memberships() {
  const listRef = useStaggerAnimation<HTMLDivElement>();

  return (
    <section id="memberships" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          Memberships
        </h2>
      </div>
      <div>
        <div className="grid gap-6 sm:grid-cols-2" ref={listRef}>
          {sortedMemberships.map((membership, index) => (
            <MembershipCard key={index} membership={membership} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface MembershipCardProps {
  membership: {
    organization: string;
    fullName: string;
    membershipType: string;
    startDate: string;
    endDate: string;
    logo: string;
    memberId?: string;
    url?: string;
    description?: string;
  };
}

function MembershipCard({ membership }: MembershipCardProps) {
  const formatDate = (dateStr: string) => {
    if (dateStr.toLowerCase() === 'present') return 'Present';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const CardContent = (
    <div className="group relative flex flex-col h-full rounded-md border border-slate-700/50 bg-slate-900/50 p-6 transition-all hover:border-slate-600 hover:bg-slate-800/50">
      {/* Organization Logo */}
      <div className="mb-4 flex justify-center">
        <div className="h-20 w-20 overflow-hidden rounded-lg bg-slate-800 p-2">
          <img
            src={membership.logo}
            alt={`${membership.organization} logo`}
            className="h-full w-full object-contain"
            onError={(e) => {
              // Fallback for missing images
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = `
                  <div class="flex h-full w-full items-center justify-center text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
        </div>
      </div>

      {/* Membership Info */}
      <div className="flex-grow text-center">
        <h3 className="font-semibold text-slate-200 mb-1">{membership.organization}</h3>
        <p className="text-sm text-slate-400 mb-1">{membership.fullName}</p>
        <p className="text-xs text-cyan-300 font-medium mb-1">{membership.membershipType}</p>
        <p className="text-xs text-slate-500">
          {formatDate(membership.startDate)} — {formatDate(membership.endDate)}
        </p>

        {membership.memberId && (
          <p className="mt-2 text-xs text-slate-500">
            ID: <span className="text-slate-400 font-mono">{membership.memberId}</span>
          </p>
        )}

        {membership.description && (
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            {membership.description}
          </p>
        )}
      </div>

      {/* Action Button */}
      {membership.url && (
        <div className="mt-auto pt-4 flex justify-center">
          <a
            href={membership.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                clipRule="evenodd"
              />
            </svg>
            Visit Website
          </a>
        </div>
      )}
    </div>
  );

  return CardContent;
}
