import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/doctor/appointments', label: 'Appointments', icon: '📅' },
  { path: '/doctor/profile', label: 'My Profile', icon: '👤' },
];

export default function DoctorSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

  return (
    <div className="doctor-sidebar">
      <div className="brand">
        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Doctor Portal</div>
        🏥 MediConnect
      </div>
      <div className="px-3 py-3 d-flex align-items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr')}`}
          alt="avatar"
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }}
        />
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: '0.72rem', opacity: 0.6 }}>Doctor</div>
        </div>
      </div>
      <nav className="mt-2">
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
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, padding: '0 20px' }}>
        <button onClick={handleLogout} className="btn btn-outline-light btn-sm w-100">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
