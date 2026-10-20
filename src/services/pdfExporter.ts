import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export interface PdfExportOptions {
  elementId?: string;
  candidateName?: string;
  onProgress?: (status: string) => void;
}

export async function exportResumeToPdf(options: PdfExportOptions = {}): Promise<void> {
  const elementId = options.elementId || 'resume-preview';
  const targetElement = document.getElementById(elementId);

  if (!targetElement) {
    throw new Error(`Resume preview element with id "${elementId}" was not found.`);
  }

  options.onProgress?.('Rendering vector document...');

  // Use html-to-image which natively supports modern CSS3/CSS4 colors including Tailwind v4's oklch()
  const dataUrl = await toPng(targetElement, {
    quality: 1.0,
    pixelRatio: 2, // High resolution (crisp 300 DPI equivalent)
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  options.onProgress?.('Compiling PDF...');

  // Load image dimensions to compute accurate page aspect ratio
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load rendered image into PDF compiler.'));
  });

  const imgWidth = 215.9; // Standard Letter width in mm (8.5 inches)
  const pageHeight = 279.4; // Standard Letter height in mm (11.0 inches)
  const imgHeight = (img.height * imgWidth) / img.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
    compress: true,
  });

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Handle multi-page if resume content runs longer than a single letter page
  while (heightLeft > 5) {
    position = -(imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  options.onProgress?.('Downloading file...');

  const cleanName = (options.candidateName || 'Resume')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanName || 'Candidate'}_Resume.pdf`;

  pdf.save(fileName);
}
