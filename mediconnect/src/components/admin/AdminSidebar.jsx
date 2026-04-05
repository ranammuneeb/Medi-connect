import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/doctors', label: 'Doctors List', icon: '👨‍⚕️' },
  { path: '/admin/appointments', label: 'Appointments', icon: '📅' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">MediConnect</div>
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
