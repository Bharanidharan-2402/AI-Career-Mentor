import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import logger from '../config/logger.js';

if (pdfjsLib?.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = false;
}

export const parsePDF = async (fileBuffer) => {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('Empty PDF buffer');
    }

    const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
    const pdfData = new Uint8Array(buffer);
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      text += textContent.items.map((item) => item.str).join(' ') + '\n';
    }

    const cleanedText = text.trim();
    if (!cleanedText) {
      throw new Error('No text could be extracted from the PDF');
    }

    logger.info('PDF parsed successfully', { pages: pdf.numPages });
    return cleanedText;
  } catch (error) {
    logger.error('PDF parsing failed', { error: error.message });
    throw new Error('Failed to parse PDF resume');
  }
};

export const parseDocx = async (fileBuffer) => {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('Empty DOCX buffer');
    }

    const result = await mammoth.extractRawText({ buffer: Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer) });
    const cleanedText = (result?.value || '').trim();

    if (!cleanedText) {
      throw new Error('No text could be extracted from the DOCX file');
    }

    logger.info('DOCX parsed successfully');
    return cleanedText;
  } catch (error) {
    logger.error('DOCX parsing failed', { error: error.message });
    throw new Error('Failed to parse DOCX resume');
  }
};

export const extractResumeText = async (fileBuffer, originalname = '', mimetype = '') => {
  const extension = path.extname(originalname || '').toLowerCase();
  const normalizedMimeType = (mimetype || '').toLowerCase();

  if (extension === '.pdf' || normalizedMimeType === 'application/pdf') {
    return parsePDF(fileBuffer);
  }

  if (extension === '.docx' || normalizedMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return parseDocx(fileBuffer);
  }

  if (extension === '.png' || extension === '.jpg' || extension === '.jpeg' || normalizedMimeType.startsWith('image/')) {
    return `Image resume uploaded: ${originalname || 'resume file'}`;
  }

  return `Resume uploaded: ${originalname || 'resume file'}`;
};

export const readResumeText = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('Resume path missing');
    }

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Resume file not found: ${absolutePath}`);
    }

    const fileBuffer = await fs.promises.readFile(absolutePath);
    return parsePDF(fileBuffer);
  } catch (error) {
    logger.error('Resume text read failed', { error: error.message });
    throw new Error('Failed to parse PDF resume');
  }
};
