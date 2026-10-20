import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      pdfWorkerUrl || 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  } catch (e) {
    console.warn('Worker configuration note:', e);
  }
}

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

export interface PdfExtractionResult {
  fullText: string;
  pageCount: number;
  pages: ExtractedPdfPage[];
  metadata?: Record<string, any>;
}

// Fallback extractor for environments where WebWorkers or PDF.js canvas are restricted
function extractRawPdfStreams(buffer: ArrayBuffer): string {
  try {
    const bytes = new Uint8Array(buffer);
    let binaryString = '';
    const CHUNK_SIZE = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }

    const extractedLines: string[] = [];

    // Find PDF text string operations: (text) Tj and [(t) 10 (ext)] TJ
    const tjRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g;
    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;

    let match;
    while ((match = tjRegex.exec(binaryString)) !== null) {
      const clean = match[1].replace(/\\([()\\])/g, '$1').trim();
      if (clean.length > 0) extractedLines.push(clean);
    }

    while ((match = tjArrayRegex.exec(binaryString)) !== null) {
      const rawInner = match[1];
      const subMatches = rawInner.match(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g) || [];
      const combined = subMatches
        .map((s) => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
        .join('')
        .trim();
      if (combined.length > 0) extractedLines.push(combined);
    }

    // If Tj operators were compressed, scan for readable plain ASCII sequences
    if (extractedLines.length < 5) {
      const asciiWords = binaryString.match(/[a-zA-Z0-9@+._\-/#:]{2,}/g) || [];
      const filtered = asciiWords.filter(
        (w) =>
          !['obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 'FlateDecode'].includes(w) &&
          !w.startsWith('/')
      );
      if (filtered.length > 15) {
        return filtered.join(' ');
      }
    }

    return extractedLines.join('\n');
  } catch (err) {
    console.error('Fallback raw stream extraction failed:', err);
    return '';
  }
}

export async function extractTextFromPdf(file: File): Promise<PdfExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();

  // Try Strategy 1: PDF.js coordinate parser
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const pages: ExtractedPdfPage[] = [];
    const fullTextParts: string[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Group items by vertical position (Y coordinate) to preserve line order accurately
      const lineMap: Map<number, { x: number; str: string }[]> = new Map();
      const Y_TOLERANCE = 4; // items within 4px belong to the same logical line

      textContent.items.forEach((item: any) => {
        if (!('str' in item) || !item.str) return;

        const y = Math.round(item.transform[5]); // Y translation coordinate
        const x = Math.round(item.transform[4]); // X translation coordinate

        let matchedY: number | null = null;
        for (const existingY of lineMap.keys()) {
          if (Math.abs(existingY - y) <= Y_TOLERANCE) {
            matchedY = existingY;
            break;
          }
        }

        if (matchedY !== null) {
          lineMap.get(matchedY)!.push({ x, str: item.str });
        } else {
          lineMap.set(y, [{ x, str: item.str }]);
        }
      });

      const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

      const pageLines: string[] = [];
      for (const y of sortedY) {
        const items = lineMap.get(y)!;
        items.sort((a, b) => a.x - b.x);

        let lineText = '';
        for (let i = 0; i < items.length; i++) {
          const curr = items[i];
          if (i === 0) {
            lineText += curr.str;
          } else {
            const prev = items[i - 1];
            const diff = curr.x - (prev.x + prev.str.length * 4);
            if (diff > 1 && !lineText.endsWith(' ') && !curr.str.startsWith(' ')) {
              lineText += ' ' + curr.str;
            } else {
              lineText += curr.str;
            }
          }
        }

        lineText = lineText.trim();
        if (lineText) {
          pageLines.push(lineText);
        }
      }

      const pageText = pageLines.join('\n');
      pages.push({ pageNumber: pageNum, text: pageText });
      fullTextParts.push(pageText);
    }

    const combined = fullTextParts.join('\n\n').trim();
    if (combined.length > 20) {
      return {
        fullText: combined,
        pageCount,
        pages,
      };
    }
  } catch (pdfJsError) {
    console.warn('PDF.js engine warning, attempting fallback stream extraction:', pdfJsError);
  }

  // Strategy 2: Fallback Stream Parser
  const fallbackText = extractRawPdfStreams(arrayBuffer);
  if (fallbackText && fallbackText.trim().length > 20) {
    return {
      fullText: fallbackText.trim(),
      pageCount: 1,
      pages: [{ pageNumber: 1, text: fallbackText.trim() }],
    };
  }

  throw new Error(
    'Unable to read text from this PDF. The document may be a scanned image without an OCR text layer, or protected by encryption.'
  );
}
