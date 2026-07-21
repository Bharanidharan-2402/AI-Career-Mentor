export const isResumeFileAccepted = (file = {}) => {
  const filename = (file.originalname || '').toLowerCase();
  const mimetype = (file.mimetype || '').toLowerCase();

  const acceptedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx'];
  const hasAcceptedExtension = acceptedExtensions.some((extension) => filename.endsWith(extension));

  const acceptedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const hasAcceptedMimeType = acceptedMimeTypes.some((type) => mimetype === type);

  return Boolean(hasAcceptedExtension || hasAcceptedMimeType);
};
