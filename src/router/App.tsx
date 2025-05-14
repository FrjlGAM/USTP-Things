import { Routes, Route } from 'react-router-dom';
import Landing from '../landing/pages/Landing';
import Dashboard from '../dashboard/pages/Dashboard';
import AdminLogin from '../admin/components/AdminLogin';
import AdminSignup from '../admin/components/AdminSignup';
import AdminDashboard from '../admin/components/AdminDashboard';
import SettingsContainer from "../dashboard/pages/SettingsContainer";
import Messages from '../dashboard/pages/Messages';
import ToRate from '../dashboard/pages/ToRate';
import Orders from '../dashboard/pages/Orders';
import CheckOut from '../dashboard/pages/CheckOut';
import { useLocation, Navigate } from 'react-router-dom';
import SellerPage from '../dashboard/pages/SellerPage';

// Wrapper component to handle checkout route with product data
function CheckOutWrapper() {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <Navigate to="/dashboard" replace />;
  }

  return <CheckOut product={product} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/likes" element={<Dashboard />} />
      <Route path="/dashboard/recently-viewed" element={<Dashboard />} />
      <Route path="/dashboard/orders" element={<Orders />} />
      <Route path="/dashboard/rate" element={<ToRate />} />
      <Route path="/dashboard/message" element={<Messages />} />
      <Route path="/dashboard/settings" element={<SettingsContainer />} />
      <Route path="/dashboard/checkout" element={<CheckOutWrapper />} />
      <Route path="/dashboard/seller" element={<SellerPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
