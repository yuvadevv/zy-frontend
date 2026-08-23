import * as pdfjsLib from 'pdfjs-dist';

// Setting up the worker for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const getPdfPageCount = async (file: File): Promise<number> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // We parse the ArrayBuffer using pdfjs-dist
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    return pdf.numPages;
  } catch (error) {
    console.error("Failed to parse PDF:", error);
    throw new Error('Failed to read PDF. Please try again.');
  }
};
