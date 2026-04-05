import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import LoginRegisterPage from './pages/auth/LoginRegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Patient Pages
import HomePage from './pages/patient/HomePage';
import DoctorListingPage from './pages/patient/DoctorListingPage';
import DoctorProfilePage from './pages/patient/DoctorProfilePage';
import AppointmentBookingPage from './pages/patient/AppointmentBookingPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PaymentPage from './pages/patient/PaymentPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageDoctorsPage from './pages/admin/ManageDoctorsPage';
import AppointmentsOverviewPage from './pages/admin/AppointmentsOverviewPage';

// Doctor Pages
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorProfileManagePage from './pages/doctor/DoctorProfileManagePage';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/home" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth */}
      <Route path="/auth/login" element={<LoginRegisterPage />} />
      <Route path="/auth/register" element={<LoginRegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Patient Routes */}
      <Route path="/patient/*" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <Routes>
            <Route path="home" element={<HomePage />} />
            <Route path="doctors" element={<DoctorListingPage />} />
            <Route path="doctors/:id" element={<DoctorProfilePage />} />
            <Route path="book/:doctorId" element={<AppointmentBookingPage />} />
            <Route path="payment/:appointmentId" element={<PaymentPage />} />
            <Route path="appointments" element={<MyAppointmentsPage />} />
            <Route path="profile" element={<PatientProfilePage />} />
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Routes>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="doctors" element={<ManageDoctorsPage />} />
            <Route path="appointments" element={<AppointmentsOverviewPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ProtectedRoute>
      } />

      {/* Doctor Routes */}
      <Route path="/doctor/*" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <Routes>
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            <Route path="appointments" element={<DoctorAppointmentsPage />} />
            <Route path="profile" element={<DoctorProfileManagePage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
