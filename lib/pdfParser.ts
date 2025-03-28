// lib/pdfParser.ts
'use server';
import pdf from 'pdf-parse';

export async function parsePDF(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    console.log('PDF buffer size:', buffer.byteLength);
    const data = await pdf(Buffer.from(buffer));
    console.log('PDF data:', {
      textLength: data.text.length,
      numpages: data.numpages,
      info: data.info,
    });
    if (!data.text) throw new Error('No text extracted from PDF');
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}