import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CertificateViewer } from '@/components/certificate/CertificateViewer';
import { ViewerToolbar } from '@/components/certificate/ViewerToolbar';
import {
  normalizeCertificate,
  isPdfFile,
  getFileTypeLabel,
} from '@/lib/certificateUtils';
import type { CertificateResource } from '@/types';

interface CertificatePreviewProps {
  certificate: CertificateResource | string;
  certName: string;
  trigger: ReactNode;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export function CertificatePreview({ certificate, certName, trigger }: CertificatePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const certificateData = normalizeCertificate(certificate);
  const isPdf = isPdfFile(certificateData.link);
  const fileType = getFileTypeLabel(certificateData.link);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset zoom when dialog closes
      setZoom(1);
    }
  };

  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;
  const isZoomed = zoom !== 1;

  // Keyboard shortcuts for zoom (only when dialog is open and not a PDF)
  useEffect(() => {
    if (!isOpen || isPdf) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.ctrlKey || e.metaKey;
      if (!isModifierPressed) return;

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleZoomReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPdf, handleZoomIn, handleZoomOut, handleZoomReset]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="w-[92vw] max-w-5xl sm:max-w-6xl max-h-[98vh] flex flex-col overflow-hidden p-0"
        aria-labelledby="certificate-dialog-title"
        aria-describedby="certificate-dialog-description"
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle id="certificate-dialog-title">{certName}</DialogTitle>
          <DialogDescription id="certificate-dialog-description">
            {fileType}
          </DialogDescription>
        </DialogHeader>
        <ViewerToolbar
          certificate={certificateData}
          certName={certName}
          isPdf={isPdf}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          isZoomed={isZoomed}
        />
        {isOpen && (
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
            <CertificateViewer
              certificate={certificateData}
              certName={certName}
              zoom={isPdf ? 1 : zoom}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
