import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/apiClient.js';
import { useResume } from '../contexts/ResumeContext.jsx';

// ─── AI Analysis Phases ───────────────────────────────────────────────────────
const PHASES = [
  { icon: '📄', text: 'Reading your resume…', sub: 'Extracting text and structure' },
  { icon: '🧠', text: 'AI is parsing your experience…', sub: 'Understanding your work history & projects' },
  { icon: '🔍', text: 'Identifying your skills…', sub: 'Mapping technologies, frameworks & tools' },
  { icon: '🎯', text: 'Building your career profile…', sub: 'Creating personalized recommendations' },
  { icon: '✨', text: 'Almost done! Finalizing insights…', sub: 'Preparing your skill map & roadmap' },
];

const PhaseDisplay = ({ phase }) => (
  <div className="flex flex-col items-center gap-3 animate-fadeIn">
    <div className="text-5xl animate-bounce-slow">{phase.icon}</div>
    <p className="text-lg font-semibold text-white">{phase.text}</p>
    <p className="text-sm text-slate-400">{phase.sub}</p>
  </div>
);

const NeuralOrb = () => (
  <div className="relative flex items-center justify-center w-40 h-40 mx-auto my-6">
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-spin-slow" />
    <div className="absolute inset-2 rounded-full border border-violet-500/20 animate-spin-reverse" />
    {/* Pulsing core */}
    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-600/40 animate-pulse-glow" />
    {/* Center brain */}
    <span className="relative text-4xl z-10">🤖</span>
    {/* Orbiting dots */}
    {[0, 72, 144, 216, 288].map((deg, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-indigo-400"
        style={{
          top: '50%',
          left: '50%',
          transform: `rotate(${deg}deg) translateX(68px) translateY(-50%)`,
          animation: `orbit 3s linear infinite`,
          animationDelay: `${i * 0.6}s`,
        }}
      />
    ))}
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full rounded-full bg-slate-700/50 h-1.5 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// ─── Skill Tag ────────────────────────────────────────────────────────────────
const SkillTag = ({ skill, delay }) => (
  <span
    className="inline-block rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs text-indigo-300 font-medium"
    style={{ animation: `fadeSlideUp 0.5s ease forwards`, animationDelay: `${delay}ms`, opacity: 0 }}
  >
    {typeof skill === 'string' ? skill : skill?.name || ''}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const UploadResumePage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | analyzing | done | error
  const [errorMessage, setErrorMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const phaseTimer = useRef(null);
  const progressTimer = useRef(null);
  const fileInputRef = useRef(null);
  const { setResumeProfile } = useResume();

  const fileName = useMemo(() => file?.name || 'No file chosen', [file]);

  // Cleanup object URLs
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // Animate phases while analyzing
  useEffect(() => {
    if (status !== 'analyzing') {
      clearInterval(phaseTimer.current);
      clearInterval(progressTimer.current);
      return;
    }

    setPhaseIndex(0);
    setProgress(5);

    phaseTimer.current = setInterval(() => {
      setPhaseIndex((p) => (p < PHASES.length - 1 ? p + 1 : p));
    }, 3500);

    progressTimer.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 4 : p));
    }, 400);

    return () => {
      clearInterval(phaseTimer.current);
      clearInterval(progressTimer.current);
    };
  }, [status]);

  const applyFile = (selectedFile) => {
    setFile(selectedFile || null);
    setPreviewText('');
    setPreviewType('');
    setErrorMessage('');
    setStatus('idle');
    setAnalysis(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!selectedFile) { setPreviewUrl(''); return; }

    if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setPreviewType(selectedFile.type);
    } else {
      setPreviewUrl('');
      setPreviewType('text/plain');
      setPreviewText('DOCX or other supported file selected. Upload to preview extracted content.');
    }
  };

  const handleFileChange = (e) => applyFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setErrorMessage('Please select a resume file first.'); return; }

    setStatus('analyzing');
    setProgress(5);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data.data || {};
      const analysisData = data.analysis || {};

      // Push to context + localStorage
      setResumeProfile({ ...analysisData, resumeUploadedAt: new Date().toISOString() });
      setAnalysis(analysisData);
      setPreviewText(data.previewText || '');
      setPreviewType(data.previewType || file.type || 'text/plain');
      if (file.type?.startsWith('image/') || file.type === 'application/pdf') {
        setPreviewUrl((cur) => cur || URL.createObjectURL(file));
      }
      setProgress(100);
      setStatus('done');
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error?.message || 'Upload failed. Please ensure the file is a supported resume format under 5MB.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const skills = analysis?.skills || [];
  const name = analysis?.contact?.name || analysis?.name || '';
  const role = analysis?.targetRole || analysis?.summary?.split(' ').slice(0, 4).join(' ') || 'Professional';

  return (
    <>
      {/* Keyframe styles */}
      <style>{`
        @keyframes orbit {
          0%   { opacity: 0.3; transform: rotate(var(--start-deg)) translateX(68px) translateY(-50%) scale(0.8); }
          50%  { opacity: 1; }
          100% { opacity: 0.3; transform: rotate(calc(var(--start-deg) + 360deg)) translateX(68px) translateY(-50%) scale(0.8); }
        }
        @keyframes spin-slow  { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-spin-slow    { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 6s linear infinite; }
        .animate-pulse-glow   { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-slow  { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-fadeIn       { animation: fadeIn 0.5s ease forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #a5b4fc, #c4b5fd, #818cf8, #a5b4fc);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .drop-zone-active {
          border-color: rgb(99 102 241);
          background: rgba(99,102,241,0.07);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
        }
        .success-pop { animation: successPop 0.5s cubic-bezier(.22,1,.36,1) forwards; }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="glass rounded-2xl p-6 border border-indigo-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl shadow-lg">
              📋
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Upload Your Resume</h1>
              <p className="text-sm text-slate-400">Our AI will analyze it and personalize your entire career journey</p>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        {status !== 'analyzing' && status !== 'done' && (
          <form onSubmit={handleUpload}>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`glass rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragging ? 'drop-zone-active' : 'border-slate-600 hover:border-indigo-500/50 hover:bg-indigo-500/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx,application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />

              {!file ? (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-3xl">
                      📁
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">Drop your resume here</p>
                      <p className="text-slate-400 text-sm mt-1">or click to browse files</p>
                    </div>
                    <p className="text-xs text-slate-500">Supports PDF, DOCX, JPG, PNG · Max 5MB</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                    {file.type === 'application/pdf' ? '📄' : file.type.startsWith('image/') ? '🖼️' : '📝'}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{fileName}</p>
                    <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <button
                type="submit"
                className="mt-4 w-full py-4 rounded-2xl font-semibold text-white text-base bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                🚀 &nbsp; Analyze with AI
              </button>
            )}

            {status === 'error' && (
              <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
                <p className="text-sm text-red-400">⚠️ {errorMessage}</p>
              </div>
            )}
          </form>
        )}

        {/* ─── ANALYZING OVERLAY ─── */}
        {status === 'analyzing' && (
          <div className="glass rounded-2xl border border-indigo-500/20 p-10 text-center space-y-6 animate-fadeIn">
            <div>
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">AI is at work</p>
              <h2 className="shimmer-text text-2xl font-bold">Getting to know you…</h2>
            </div>

            <NeuralOrb />

            <PhaseDisplay phase={PHASES[phaseIndex]} />

            <div className="space-y-2">
              <ProgressBar progress={progress} />
              <p className="text-xs text-slate-500 text-right">{Math.round(progress)}%</p>
            </div>

            <p className="text-xs text-slate-500 italic">
              This usually takes 15–30 seconds depending on resume length
            </p>
          </div>
        )}

        {/* ─── SUCCESS STATE ─── */}
        {status === 'done' && analysis && (
          <div className="space-y-5 success-pop">
            {/* Success banner */}
            <div className="glass rounded-2xl border border-green-500/30 bg-green-500/5 p-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-white">
                {name ? `Nice to meet you, ${name}!` : 'Resume Analyzed!'}
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Your AI profile is ready. All modules are now personalized for you.
              </p>
            </div>

            {/* Profile summary */}
            {(analysis.summary || skills.length > 0) && (
              <div className="glass rounded-2xl border border-indigo-500/15 p-6 space-y-4">
                {analysis.summary && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-2">AI Summary</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{analysis.summary}</p>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Detected Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 20).map((skill, i) => (
                        <SkillTag key={i} skill={skill} delay={i * 60} />
                      ))}
                      {skills.length > 20 && (
                        <span className="text-xs text-slate-500 self-center">+{skills.length - 20} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modules activated grid */}
            <div className="glass rounded-2xl border border-slate-700/50 p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-4">Modules Activated</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { icon: '👤', label: 'Profile', color: 'text-blue-400' },
                  { icon: '🎯', label: 'Skills', color: 'text-green-400' },
                  { icon: '🗺️', label: 'Roadmap', color: 'text-violet-400' },
                  { icon: '💼', label: 'Projects', color: 'text-amber-400' },
                  { icon: '🎤', label: 'Interview', color: 'text-pink-400' },
                  { icon: '💬', label: 'AI Chat', color: 'text-indigo-400' },
                ].map(({ icon, label, color }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl bg-slate-800/40 border border-slate-700/50 px-3 py-2"
                    style={{ animation: `fadeSlideUp 0.4s ease forwards`, animationDelay: `${i * 80}ms`, opacity: 0 }}
                  >
                    <span className={`text-lg ${color}`}>{icon}</span>
                    <span className="text-sm text-slate-300 font-medium">{label}</span>
                    <span className="ml-auto text-green-400 text-xs">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume preview */}
            {(previewUrl || previewText) && (
              <div className="glass rounded-2xl border border-slate-700/50 p-5">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-4">Resume Preview</p>
                {previewUrl && previewType === 'application/pdf' ? (
                  <iframe src={previewUrl} title="Resume preview" className="h-[400px] w-full rounded-xl border border-slate-700" />
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Resume preview" className="max-h-[400px] w-full rounded-xl object-contain" />
                ) : previewText ? (
                  <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-800/50 p-4 text-xs text-slate-400">
                    {previewText}
                  </pre>
                ) : null}
              </div>
            )}

            {/* Upload another */}
            <button
              type="button"
              onClick={() => { setStatus('idle'); setFile(null); setPreviewUrl(''); setPreviewText(''); setAnalysis(null); }}
              className="w-full py-3 rounded-2xl border border-slate-600 text-slate-400 hover:border-indigo-500/50 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              Upload a different resume
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadResumePage;
