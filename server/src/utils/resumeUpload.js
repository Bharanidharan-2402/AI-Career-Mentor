export const isResumeFileAccepted = (file = {}) => {
  const filename = file.originalname || '';
  const mimetype = file.mimetype || '';
  const isPdfExtension = filename.toLowerCase().endsWith('.pdf');
  const isPdfMimeType = /pdf/i.test(mimetype);

  return Boolean(isPdfExtension || isPdfMimeType);
};
