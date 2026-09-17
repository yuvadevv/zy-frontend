import { PDFDocument } from 'pdf-lib';

export const getPdfPageCountFromBuffer = async (data: Uint8Array | ArrayBuffer): Promise<number> => {
  try {
    const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
    return pdf.getPageCount();
  } catch (error) {
    console.error("Failed to parse PDF with pdf-lib:", error);
    throw new Error('Failed to read PDF. Please try again.');
  }
};

export const getPdfPageCount = async (file: File): Promise<number> => {
  const arrayBuffer = await file.arrayBuffer();
  return getPdfPageCountFromBuffer(arrayBuffer);
};
