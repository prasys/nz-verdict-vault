// lib/pdfParser.ts
'use server';
import PDFParser from 'pdf2json';

export async function parsePDF(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    console.log('PDF buffer size:', buffer.byteLength);
    
    // Use pdf2json to parse the PDF
    const pdfText = await extractTextWithPdf2json(buffer);
    
    if (pdfText && pdfText.trim().length > 0) {
      console.log('PDF text extracted successfully with length:', pdfText.length);
      return pdfText;
    }

  //   console.log('No text found, attempting OCR...');
  //   const { data: ocrData } = await Tesseract.recognize(buffer, 'eng');
  //   console.log('OCR result:', { textLength: ocrData.text.length });
  //   if (!ocrData.text) throw new Error('No text extracted after OCR');
  //   return ocrData.text;
  // } catch (error) {
  //   console.error('PDF parsing error:', error);
  //   throw new Error('Failed to parse PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  // }
}

async function extractTextWithPdf2json(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1); // 1 = silent mode
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(errData.parserError || 'PDF parsing error'));
    });
    
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        // Extract text from all pages
        let text = '';
        if (pdfData && pdfData.Pages) {
          for (const page of pdfData.Pages) {
            if (page.Texts) {
              for (const textItem of page.Texts) {
                if (textItem.R) {
                  for (const r of textItem.R) {
                    if (r.T) {
                      // Decode URI-encoded text
                      text += decodeURIComponent(r.T) + ' ';
                    }
                  }
                }
              }
            }
            text += '\n\n'; // Add page breaks
          }
        }
        resolve(text.trim());
      } catch (err) {
        reject(err);
      }
    });
    
    // Load PDF from buffer
    pdfParser.parseBuffer(Buffer.from(buffer));
  });
}