import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/doctor/appointments', label: 'Appointments', icon: '📅' },
  { path: '/doctor/profile', label: 'Profile', icon: '👤' },
];

export default function DoctorSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="doctor-sidebar">
      <div className="sidebar-brand">MediConnect</div>
      <div className="d-flex align-items-center gap-2 px-4 pb-3" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 8 }}>
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr')}&background=5f6fff&color=fff`}
          alt="avatar"
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151' }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Doctor</div>
        </div>
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, padding: '0 24px' }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline-secondary w-100"
          style={{ borderRadius: 8, fontSize: '0.88rem', fontWeight: 500 }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
