import { useState } from 'react';
import api from '../api/apiClient.js';

const UploadResumePage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return setMessage('Please select a PDF resume first.');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Resume uploaded successfully. Ready to analyze!');
    } catch (error) {
      console.error(error);
      setMessage('Upload failed. Please ensure the file is a PDF under 5MB.');
    }
  };

  return (
    <div className='rounded-3xl bg-white p-8 shadow-xl'>
      <h2 className='text-2xl font-semibold text-slate-900'>Upload Resume</h2>
      <p className='mt-3 text-slate-600'>Submit your resume to let the AI analyze skills, experience, and ATS readiness.</p>
      <form onSubmit={handleUpload} className='mt-8 space-y-5'>
        <input type='file' accept='application/pdf' onChange={handleFileChange} className='block w-full text-slate-700' />
        <button type='submit' className='rounded-2xl bg-brand px-5 py-3 text-white'>Upload Resume</button>
      </form>
      {message && <p className='mt-4 text-sm text-slate-600'>{message}</p>}
    </div>
  );
};

export default UploadResumePage;
