import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Background from '../components/Background';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed left-0 top-0">
        <Sidebar onLoginClick={() => setLoginOpen(true)} onSignupClick={() => setSignupOpen(true)} />
      </div>
      <div className="flex-1 flex flex-col ml-[348px]">
        <div className="fixed top-0 right-0 left-[348px] z-10">
          <Header />
        </div>
        <div className="flex-1 mt-16 overflow-y-auto">
          <div className="relative min-h-[calc(100vh-4rem)]">
            <MainContent />
            <Background />
          </div>
        </div>
      </div>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <SignupModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </div>
  );
}
