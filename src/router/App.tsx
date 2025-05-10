import { Routes, Route } from 'react-router-dom';
import Landing from '../landing/pages/Landing';
import Dashboard from '../dashboard/pages/Dashboard';
import AdminLogin from '../admin/components/AdminLogin';
import AdminSignup from '../admin/components/AdminSignup';
import AdminDashboard from '../admin/components/AdminDashboard';
import Settings from '../dashboard/pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
