import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/doctors', label: 'Manage Doctors', icon: '👨‍⚕️' },
  { path: '/admin/appointments', label: 'Appointments', icon: '📅' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Admin logged out');
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="brand">🏥 MediConnect<br /><small style={{ fontSize: '0.7rem', opacity: 0.6 }}>Admin Panel</small></div>
      <nav className="mt-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, padding: '0 24px' }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline-light btn-sm w-100"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
