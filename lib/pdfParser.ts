// lib/pdfParser.ts
import pdf from 'pdf-parse';

export async function parsePDF(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}