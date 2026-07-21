import { isResumeFileAccepted } from '../src/utils/resumeUpload.js';

describe('resume upload file acceptance', () => {
  it('accepts PDF, PNG, JPG, JPEG and DOCX resumes', () => {
    const acceptedFiles = [
      { originalname: 'resume.pdf', mimetype: 'application/pdf' },
      { originalname: 'resume.png', mimetype: 'image/png' },
      { originalname: 'resume.jpg', mimetype: 'image/jpeg' },
      { originalname: 'resume.jpeg', mimetype: 'image/jpeg' },
      { originalname: 'resume.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    ].map(isResumeFileAccepted);

    expect(acceptedFiles).toEqual([true, true, true, true, true]);
  });
});
