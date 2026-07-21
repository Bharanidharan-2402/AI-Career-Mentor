import { useEffect, useMemo, useState } from 'react';
import api from '../api/apiClient.js';
import { updateStoredUserProfile } from '../utils/auth.js';

const UploadResumePage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [previewType, setPreviewType] = useState('');

  useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const fileName = useMemo(() => file?.name || 'No file selected', [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile || null);
    setPreviewText('');
    setPreviewType('');
    setMessage('');

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }

    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setPreviewType(selectedFile.type);
      return;
    }

    if (selectedFile.type === 'application/pdf') {
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setPreviewType(selectedFile.type);
      return;
    }

    setPreviewUrl('');
    setPreviewType('text/plain');
    setPreviewText('DOCX or other supported file selected. Upload it to preview the extracted content.');
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return setMessage('Please select a resume file first.');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const data = response.data.data || {};
      const analysis = data.analysis || {};
      updateStoredUserProfile({ aiProfile: analysis, resumeUploadedAt: new Date().toISOString() });
      setPreviewText(data.previewText || '');
      setPreviewType(data.previewType || file.type || 'text/plain');
      if (file.type?.startsWith('image/') || file.type === 'application/pdf') {
        setPreviewUrl((current) => current || URL.createObjectURL(file));
      } else {
        setPreviewUrl('');
      }
      setMessage(`Resume uploaded and analyzed successfully. Your skill profile is ready for roadmap, project, and interview guidance.`);
    } catch (error) {
      console.error(error);
      const serverMessage = error?.response?.data?.error?.message;
      setMessage(serverMessage || 'Upload failed. Please ensure the file is a supported resume format under 5MB.');
    }
  };

  return (
    <div className='rounded-3xl bg-white p-8 shadow-xl'>
      <h2 className='text-2xl font-semibold text-slate-900'>Upload Resume</h2>
      <p className='mt-3 text-slate-600'>Submit your resume to let the AI analyze skills, experience, and ATS readiness.</p>
      <form onSubmit={handleUpload} className='mt-8 space-y-5'>
        <input
          type='file'
          accept='.pdf,.png,.jpg,.jpeg,.docx,application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          onChange={handleFileChange}
          className='block w-full text-slate-700'
        />
        <button type='submit' className='rounded-2xl bg-brand px-5 py-3 text-white'>Upload Resume</button>
      </form>

      {file && (
        <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
          <p className='text-sm font-semibold text-slate-800'>Selected resume</p>
          <p className='mt-1 break-all text-sm text-slate-600'>{fileName}</p>
        </div>
      )}

      {(previewUrl || previewText) && (
        <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
          <p className='text-sm font-semibold text-slate-800'>Uploaded resume preview</p>
          {previewUrl && (previewType === 'application/pdf' ? (
            <iframe src={previewUrl} title='Resume preview' className='mt-4 h-[500px] w-full rounded-xl border border-slate-200' />
          ) : (
            <img src={previewUrl} alt='Resume preview' className='mt-4 max-h-[500px] w-full rounded-xl object-contain' />
          ))}
          {previewText && !previewUrl && (
            <pre className='mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-sm text-slate-700'>{previewText}</pre>
          )}
        </div>
      )}

      {message && <p className='mt-4 text-sm text-slate-600'>{message}</p>}
    </div>
  );
};

export default UploadResumePage;
