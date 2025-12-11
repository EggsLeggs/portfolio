import { sortedCertifications } from '@/lib/loadConfig';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { CertificatePreview } from '@/components/CertificatePreview';
import type { Certification } from '@/types';
import { Eye, LinkSimple } from '@phosphor-icons/react';

export function Certifications() {
  const listRef = useStaggerAnimation<HTMLDivElement>();

  return (
    <section id="certifications" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          Certifications
        </h2>
      </div>
      <div>
        <div className="grid gap-6 sm:grid-cols-2" ref={listRef}>
          {sortedCertifications.map((cert, index) => (
            <CertificationCard key={index} certification={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CertificationCardProps {
  certification: Certification;
}

function CertificationCard({ certification }: CertificationCardProps) {
  const formattedDate = new Date(certification.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  const hasCertificate = Boolean(certification.certificate);
  const wrapCardWithPreview = hasCertificate;
  const showViewButton = hasCertificate && !wrapCardWithPreview;

  const CardContent = (
    <div className="group relative flex flex-col h-full rounded-md border border-slate-700/50 bg-slate-900/50 p-6 transition-all hover:border-slate-600 hover:bg-slate-800/50">
      {/* Badge Image */}
      <div className="mb-4 flex justify-center">
        <div className="h-24 w-24 overflow-hidden rounded-lg bg-slate-800 p-2">
          <img
            src={certification.badge}
            alt={`${certification.name} badge`}
            className="h-full w-full object-contain"
            onError={(e) => {
              // Fallback for missing images
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = `
                  <div class="flex h-full w-full items-center justify-center text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
        </div>
      </div>

      {/* Certification Info */}
      <div className="text-center flex-grow">
        <h3 className="font-semibold text-slate-200 mb-1">{certification.name}</h3>
        <p className="text-sm text-slate-400 mb-1">{certification.issuer}</p>
        <p className="text-xs text-slate-500">{formattedDate}</p>
        {certification.description && (
          <p className="mt-2 text-sm text-slate-400 leading-relaxed break-words overflow-wrap-anywhere">
            {certification.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-4 flex flex-col gap-2">
        {/* View Certificate Button Slot */}
        {showViewButton && certification.certificate && (
          <CertificatePreview
            certificate={certification.certificate}
            certName={certification.name}
            trigger={
              <button className="inline-flex w-full items-center justify-center px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-400/10 rounded-md hover:bg-cyan-400/20 transition-colors">
                <Eye weight="bold" className="mr-1.5 h-4 w-4" />
                View Certificate
              </button>
            }
          />
        )}

        {/* Verify Button Slot */}
        {certification.url && (
          <a
            href={certification.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="inline-flex w-full items-center justify-center px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors"
          >
          <LinkSimple weight="bold" className="mr-1.5 h-4 w-4" />
            Verify
          </a>
        )}
      </div>
    </div>
  );

  // If there's a certificate, make the whole card clickable
  if (wrapCardWithPreview && certification.certificate) {
    return (
      <CertificatePreview
        certificate={certification.certificate}
        certName={certification.name}
        trigger={
          <div className="cursor-pointer">
            {CardContent}
          </div>
        }
      />
    );
  }

  return CardContent;
}
