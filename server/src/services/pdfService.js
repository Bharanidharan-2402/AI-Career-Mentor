import * as pdfjsLib from 'pdfjs-dist';
import logger from '../config/logger.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parsePDF = async (fileBuffer) => {
  try {
    const pdf = await pdfjsLib.getDocument(fileBuffer).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      text += textContent.items.map((item) => item.str).join(' ') + '\n';
    }
    
    logger.info('PDF parsed successfully', { pages: pdf.numPages });
    return text;
  } catch (error) {
    logger.error('PDF parsing failed', { error });
    throw new Error('Failed to parse PDF resume');
  }
};
