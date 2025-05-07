import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Background from '../components/Background';
import LoginModal from '../components/LoginModal';

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <div className="flex min-h-screen relative">
      <Sidebar onLoginClick={() => setLoginOpen(true)} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center relative">
          <MainContent />
          <Background />
        </div>
      </div>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
