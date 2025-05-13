import { Routes, Route } from 'react-router-dom';
import Landing from '../landing/pages/Landing';
import Dashboard from '../dashboard/pages/Dashboard';
import AdminLogin from '../admin/components/AdminLogin';
import AdminSignup from '../admin/components/AdminSignup';
import AdminDashboard from '../admin/components/AdminDashboard';
import SettingsContainer from "../dashboard/pages/SettingsContainer";
import Messages from '../dashboard/pages/Messages';
import ToRate from '../dashboard/pages/ToRate';
import Pickup from '../dashboard/pages/Pickup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/likes" element={<Dashboard />} />
      <Route path="/dashboard/recently-viewed" element={<Dashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/settings" element={<SettingsContainer />} />
      <Route path="/dashboard/messages" element={<Messages />} />
      <Route path="/dashboard/to-rate" element={<ToRate />} />
      <Route path="/dashboard/pickup" element={<Pickup />} />
    </Routes>
  );
}

export default App;
