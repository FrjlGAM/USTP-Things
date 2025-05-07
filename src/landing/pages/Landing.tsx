import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Background from '../components/Background';

export default function Landing() {
  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center relative">
          <MainContent />
          <Background />
        </div>
      </div>
    </div>
  );
}
