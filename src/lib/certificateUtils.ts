/**
 * Utility functions for certificate handling
 * These are pure functions that are SSR-safe
 */

import type { CertificateResource } from '@/types';

/**
 * Normalize certificate data to CertificateResource format
 */
export function normalizeCertificate(
  certificate: CertificateResource | string
): CertificateResource {
  return typeof certificate === 'string' ? { link: certificate } : certificate;
}

/**
 * Check if a file is a PDF based on its URL
 */
export function isPdfFile(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf');
}

/**
 * Build PDF URL with viewer parameters to suppress default toolbar/sidebar and disable scrolling
 */
export function buildPdfUrl(url: string): string {
  const params = 'toolbar=0&navpanes=0&scrollbar=0&view=FitH';
  const [base, hash] = url.split('#');

  if (!hash) return `${base}#${params}`;
  if (hash.includes('toolbar=0') || hash.includes('navpanes=0')) return url;

  return `${base}#${hash}&${params}`;
}

/**
 * Get human-readable file type label
 */
export function getFileTypeLabel(url: string): string {
  const extension = url.toLowerCase().split('.').pop() || '';

  switch (extension) {
    case 'pdf':
      return 'certificate document (pdf)';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return 'certificate image';
    default:
      return 'certificate document';
  }
}

/**
 * Parse aspect ratio string (e.g., "16/9" or "16 / 9") into width and height ratios
 */
export function parseAspectRatio(value: string): { widthRatio: number; heightRatio: number } {
  const parts = value.split('/').map(part => Number(part.trim()));
  if (parts.length === 2 && parts.every(n => Number.isFinite(n) && n > 0)) {
    return { widthRatio: parts[0], heightRatio: parts[1] };
  }
  return { widthRatio: 16, heightRatio: 9 };
}

/**
 * Calculate PDF height: use config height if provided, otherwise calculate from aspectRatio
 * This function is safe to call on the server (returns default) and client (calculates dynamically)
 */
export function calculatePdfHeight(certificateData: CertificateResource): number {
  // If aspectRatio is provided, calculate height from container width
  if (certificateData.aspectRatio) {
    const { widthRatio, heightRatio } = parseAspectRatio(certificateData.aspectRatio);
    // Use a reasonable container width (92vw with max-w-5xl, approximately 896px on large screens)
    // On smaller screens, use viewport width
    const containerWidth = typeof window !== 'undefined'
      ? Math.min(window.innerWidth * 0.92, 896)
      : 896;
    return Math.round((containerWidth * heightRatio) / widthRatio);
  }

  // Default fallback height
  return 1200;
}

