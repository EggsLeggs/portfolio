import { ArrowSquareOut, Download, MagnifyingGlassMinus, MagnifyingGlassPlus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import type { CertificateResource } from '@/types';

interface ViewerToolbarProps {
  certificate: CertificateResource;
  certName: string;
  isPdf: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  isZoomed?: boolean;
}

export function ViewerToolbar({
  certificate,
  certName,
  isPdf,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canZoomIn = false,
  canZoomOut = false,
  isZoomed = false,
}: ViewerToolbarProps) {
  const handleOpenInNewTab = () => {
    window.open(certificate.link, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificate.link;
    link.download = `${certName.replace(/\s+/g, '-').toLowerCase()}.${certificate.link.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-between gap-2 border-b border-slate-700/50 px-4 py-2 bg-slate-900/50">
      <div className="flex items-center gap-2">
        {!isPdf && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              disabled={!canZoomIn}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30"
              aria-label="Zoom in"
            >
              <MagnifyingGlassPlus className="h-4 w-4" weight="bold" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              disabled={!canZoomOut}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30"
              aria-label="Zoom out"
            >
              <MagnifyingGlassMinus className="h-4 w-4" weight="bold" aria-hidden="true" />
            </Button>
            {isZoomed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomReset}
                className="h-8 px-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                aria-label="Reset zoom"
              >
                Reset
              </Button>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenInNewTab}
          className="h-8 px-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 [&_svg]:size-3.5"
          aria-label={`Open ${certName} in new tab`}
        >
          <ArrowSquareOut className="mr-1.5 h-3.5 w-3.5" weight="bold" aria-hidden="true" />
          Open
        </Button>
        {!isPdf && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 px-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 [&_svg]:size-3.5"
            aria-label={`Download ${certName}`}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" weight="bold" aria-hidden="true" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
}

