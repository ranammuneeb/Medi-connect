import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';


import LoginRegisterPage from './pages/auth/LoginRegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';


import LandingPage from './pages/public/LandingPage';
import PublicAboutPage from './pages/public/PublicAboutPage';
import PublicContactPage from './pages/public/PublicContactPage';


import HomePage from './pages/patient/HomePage';
import DoctorListingPage from './pages/patient/DoctorListingPage';
import DoctorProfilePage from './pages/patient/DoctorProfilePage';
import AppointmentBookingPage from './pages/patient/AppointmentBookingPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PaymentPage from './pages/patient/PaymentPage';


import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageDoctorsPage from './pages/admin/ManageDoctorsPage';
import AppointmentsOverviewPage from './pages/admin/AppointmentsOverviewPage';


import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorProfileManagePage from './pages/doctor/DoctorProfileManagePage';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/landing" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/home" replace />;
}

export default function App() {
  return (
    <Routes>
      {}
      <Route path="/" element={<RootRedirect />} />

      {}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/about" element={<PublicAboutPage />} />
      <Route path="/contact" element={<PublicContactPage />} />
      <Route path="/all-doctors" element={<DoctorListingPage />} />
      <Route path="/all-doctors/:id" element={<DoctorProfilePage />} />

      {}
      <Route path="/login" element={<LoginRegisterPage />} />
      <Route path="/auth/login" element={<LoginRegisterPage />} />
      <Route path="/auth/register" element={<LoginRegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {}
      <Route path="/patient}
      <Route path="/admin}
      <Route path="/doctor}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
