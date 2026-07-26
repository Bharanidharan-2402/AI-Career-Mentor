import { getUserProfile, setUserProfile, updateStoredUserProfile } from '../utils/auth.js';
import api from '../api/apiClient.js';
import { useEffect, useRef, useState } from 'react';

const normalize = (val) => {
  if (!val) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        return val;
      }
    }
    return val;
  }
  return val;
};

const renderEducation = (education = []) => (
  <div className='mt-3 space-y-3'>
    {education.length > 0 ? education.map((raw, i) => {
      const e = normalize(raw);
      return (
      <div key={i} className='rounded-xl border border-slate-200 bg-white p-4'>
        <div className='flex items-baseline justify-between'>
          <div>
            <p className='text-sm font-semibold text-slate-900'>{(e && (e.degree || e.program || e.title || e.institution)) || (typeof e === 'string' ? e : '')}</p>
            <p className='text-xs text-slate-600'>{(e && (e.institution || e.school)) || ''}</p>
          </div>
          <div className='text-xs text-slate-500'>{(e && (e.duration || e.year)) || ''}</div>
        </div>
        {e && e.grade && <p className='mt-2 text-sm text-slate-600'>Grade: {e.grade}</p>}
      </div>
    )}) : <p className='text-slate-500'>No education details extracted yet.</p>}
  </div>
);

const renderExperience = (experience = []) => (
  <div className='mt-3 space-y-3'>
    {experience.length > 0 ? experience.map((raw, i) => {
      const e = normalize(raw);
      return (
      <div key={i} className='rounded-xl border border-slate-200 bg-white p-4'>
        <p className='text-sm font-semibold text-slate-900'>{(e && (e.role || e.title || e.position)) || (typeof e === 'string' ? e : '')}</p>
        <p className='text-xs text-slate-600'>{(e && (e.company || e.organization)) || ''} {e && (e.duration || '') ? `• ${e.duration || ''}` : ''}</p>
        {e && e.description && <p className='mt-2 text-sm text-slate-700'>{e.description}</p>}
      </div>
    )}) : <p className='text-slate-500'>No experience details extracted yet.</p>}
  </div>
);

const renderProjects = (projects = []) => (
  <div className='mt-3 space-y-3'>
    {projects.length > 0 ? projects.map((raw, i) => {
      const p = normalize(raw);
      return (
      <div key={i} className='rounded-xl border border-slate-200 bg-white p-4'>
        <p className='text-sm font-semibold text-slate-900'>{(p && (p.title || p.name)) || (typeof p === 'string' ? p : '')}</p>
        {p && p.description && <p className='mt-2 text-sm text-slate-700'>{p.description}</p>}
        {p && p.link && <a className='mt-2 block text-xs text-brand underline' href={p.link} target='_blank' rel='noreferrer'>{p.link}</a>}
      </div>
    )}) : <p className='text-slate-500'>No projects extracted yet.</p>}
  </div>
);

const renderCertifications = (certs = []) => (
  <div className='mt-3 space-y-2'>
    {certs.length > 0 ? certs.map((raw, i) => {
      const c = normalize(raw);
      return (
      <div key={i} className='rounded-xl border border-slate-200 bg-white p-3'>
        <p className='text-sm font-semibold text-slate-900'>{(c && (c.name || c.title)) || (typeof c === 'string' ? c : '')}</p>
        <p className='text-xs text-slate-600'>{(c && (c.issuer || c.authority)) || ''} {c && c.year ? `• ${c.year}` : ''}</p>
      </div>
    )}) : <p className='text-slate-500'>No certifications extracted yet.</p>}
  </div>
);

const renderSkills = (skills = []) => (
  <div className='mt-3 flex flex-wrap gap-2'>
    {skills.length > 0 ? skills.map((raw, i) => {
      const s = normalize(raw);
      return <span key={i} className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'>{typeof s === 'string' ? s : s.name || JSON.stringify(s)}</span>;
    }) : <p className='text-slate-500'>No skills extracted yet.</p>}
  </div>
);

const ProfilePage = () => {
  const [user, setUser] = useState(() => getUserProfile());
  const [selectedFileName, setSelectedFileName] = useState('');
  const [photoStatus, setPhotoStatus] = useState('idle');
  const [photoError, setPhotoError] = useState(false);
  const fileInputRef = useRef(null);
  const contact = user?.aiProfile?.contact || {};
  const profile = user?.aiProfile || {};

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/profile');
        if (response?.data?.success) {
          const serverUser = response.data.data.user;
          setUser(serverUser);
          setUserProfile(serverUser);
          setPhotoError(false);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    loadProfile();
  }, []);

  const education = profile.education || [];
  const experience = profile.experience || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];
  const skills = profile.skills || [];

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    setPhotoStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('photo', file);
      // Let the browser set the multipart boundary header
      const res = await api.post('/profile/photo', formData);
      const updatedUser = res.data.data.user;
      updateStoredUserProfile(updatedUser);
      setUser(updatedUser);
      setPhotoError(false);
      setPhotoStatus('uploaded');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error?.message || err?.message || 'Photo upload failed';
      alert(msg);
      setPhotoStatus('error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const uploadBase = apiUrl.replace(/\/api\/?$/, '');
  const photoUrl = user?.photoUrl || null;
  const resumeUrl = profile?.resume?.filePath ? new URL(`/uploads/${profile.resume.filePath.split('/').pop()}`, uploadBase).href : null;

  useEffect(() => {
    if (photoUrl) {
      setPhotoError(false);
    }
  }, [photoUrl]);

  return (
    <div className='rounded-3xl bg-white p-8 shadow-xl'>
      <h2 className='text-2xl font-semibold text-slate-900'>Profile</h2>
      <div className='mt-6 grid gap-6 sm:grid-cols-2'>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Name</p>
          <p className='mt-3 text-xl font-semibold text-slate-900'>{user?.name || 'Student'}</p>
          <div className='mt-4'>
            <label className='text-sm text-slate-500 block'>Profile photo</label>
            <div className='mt-2 flex items-center gap-4'>
              {photoUrl && !photoError ? (
                <img
                  onError={() => setPhotoError(true)}
                  src={photoUrl}
                  alt='Profile'
                  className='h-20 w-20 rounded-full object-cover'
                />
              ) : (
                <div className='h-20 w-20 rounded-full bg-slate-200' />
              )}
              <div className='flex flex-col gap-2'>
                <button
                  type='button'
                  className='rounded-2xl bg-brand px-4 py-2 text-white hover:bg-brand-dark'
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose photo
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handlePhotoChange}
                />
                <p className='text-xs text-slate-500'>
                  {photoStatus === 'uploading'
                    ? 'Uploading photo...'
                    : photoStatus === 'uploaded'
                      ? 'Photo uploaded successfully'
                      : photoUrl && !photoError
                        ? 'Photo uploaded successfully'
                        : selectedFileName
                          ? `Selected: ${selectedFileName}`
                          : 'No photo selected'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Email</p>
          <p className='mt-3 text-xl font-semibold text-slate-900'>{contact.email || user?.email || 'n/a'}</p>
        </div>
      </div>
      {resumeUrl && (
        <div className='mt-6 rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Current resume</p>
          <a href={resumeUrl} target='_blank' rel='noreferrer' className='mt-3 inline-block text-brand underline'>View resume</a>
        </div>
      )}
      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Mobile</p>
          <p className='mt-3 text-xl font-semibold text-slate-900'>{contact.phone || contact.mobile || 'n/a'}</p>
        </div>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Target Career Goal</p>
          <p className='mt-3 text-xl font-semibold text-slate-900'>{user?.careerGoal || 'Software Engineer'}</p>
        </div>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        <div className='rounded-3xl bg-slate-50 p-6'>
            <p className='text-sm text-slate-500'>Education</p>
            {renderEducation(education)}
        </div>
        <div className='rounded-3xl bg-slate-50 p-6'>
            <p className='text-sm text-slate-500'>Experience</p>
            {renderExperience(experience)}
        </div>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Projects</p>
            {renderProjects(projects)}
        </div>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Certifications</p>
            {renderCertifications(certifications)}
        </div>
      </div>

      <div className='mt-6 rounded-3xl bg-slate-50 p-6'>
        <p className='text-sm text-slate-500'>Skills</p>
        {renderSkills(skills)}
      </div>
    </div>
  );
};

export default ProfilePage;
