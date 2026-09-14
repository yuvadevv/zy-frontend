import * as pdfjsLib from 'pdfjs-dist';

// Setting up the worker for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const getPdfPageCountFromBuffer = async (data: Uint8Array | ArrayBuffer): Promise<number> => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: data instanceof Uint8Array ? data : new Uint8Array(data) }).promise;
    return pdf.numPages;
  } catch (error) {
    console.error("Failed to parse PDF:", error);
    throw new Error('Failed to read PDF. Please try again.');
  }
};

export const getPdfPageCount = async (file: File): Promise<number> => {
  const arrayBuffer = await file.arrayBuffer();
  return getPdfPageCountFromBuffer(arrayBuffer);
};
