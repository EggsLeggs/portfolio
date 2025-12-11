import { useState, useEffect, useRef } from 'react';
import type { CertificateResource } from '@/types';
import { isPdfFile, buildPdfUrl, calculatePdfHeight } from '@/lib/certificateUtils';

interface CertificateViewerProps {
  certificate: CertificateResource;
  certName: string;
  onLoad?: () => void;
  onError?: () => void;
  zoom?: number;
}

export function CertificateViewer({
  certificate,
  certName,
  onLoad,
  onError,
  zoom = 1,
}: CertificateViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isPdf = isPdfFile(certificate.link);
  const pdfUrl = isPdf ? buildPdfUrl(certificate.link) : undefined;
  const pdfHeight = isPdf ? (certificate.height || calculatePdfHeight(certificate)) : undefined;

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [certificate.link]);

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (hasError) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-900 rounded-md"
        role="alert"
        aria-live="polite"
      >
        <div className="mb-4 text-slate-500" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-slate-300 mb-2 font-medium">Unable to load certificate</h3>
        <p className="text-sm text-slate-500 mb-4">
          The certificate file could not be loaded. It may be missing or inaccessible.
        </p>
        <a
          href={certificate.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-400 hover:text-cyan-300 underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
        >
          Try opening in a new tab
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-md bg-slate-900">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10"
          role="status"
          aria-live="polite"
          aria-label="Loading certificate"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"
              aria-hidden="true"
            />
            <p className="text-sm text-slate-400">Loading certificate...</p>
          </div>
        </div>
      )}

      {isPdf ? (
        <div
          className="w-full rounded-md bg-slate-900 overflow-hidden"
          style={{ height: `${pdfHeight}px` }}
        >
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="w-full h-full border-0"
            style={{ display: 'block' }}
            title={`${certName} certificate`}
            onLoad={handleIframeLoad}
            aria-label={`${certName} certificate document`}
            tabIndex={0}
          />
        </div>
      ) : (
        <div
          className="w-full overflow-auto rounded-md"
          style={{ maxHeight: 'calc(98vh - 200px)' }}
        >
          <div
            className="inline-block"
            style={{
              width: zoom === 1 ? '100%' : `${100 * zoom}%`,
            }}
          >
            <img
              ref={imgRef}
              src={certificate.link}
              alt={`${certName} certificate`}
              className="block rounded-md bg-slate-900"
              style={{
                width: '100%',
                height: 'auto',
                transition: zoom === 1 ? 'none' : 'width 0.2s ease-out',
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}

