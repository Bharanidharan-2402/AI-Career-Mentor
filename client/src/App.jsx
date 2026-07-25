import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UploadResumePage from './pages/UploadResumePage.jsx';
import SkillAnalysisPage from './pages/SkillAnalysisPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import GoogleCallbackPage from './pages/GoogleCallbackPage.jsx';

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='register' element={<RegisterPage />} />
      <Route path='auth/google/callback' element={<GoogleCallbackPage />} />

      <Route path='/' element={<Layout />}>
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='upload-resume' element={<UploadResumePage />} />
        <Route path='skills' element={<SkillAnalysisPage />} />
        <Route path='roadmap' element={<RoadmapPage />} />
        <Route path='projects' element={<ProjectsPage />} />
        <Route path='interview' element={<InterviewPage />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='chat' element={<ChatPage />} />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
