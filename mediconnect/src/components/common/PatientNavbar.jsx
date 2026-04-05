import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

export default function PatientNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        {/* Brand */}
        <Link to="/patient/home" className="navbar-brand">
          <img src={assets.logo} alt="MediConnect" style={{ height: 36 }} />
        </Link>

        {/* Nav Links */}
        <ul className="navbar-links">
          <li><Link to="/patient/home" className={isActive('/patient/home') ? 'active' : ''}>HOME</Link></li>
          <li><Link to="/patient/doctors" className={isActive('/patient/doctors') ? 'active' : ''}>ALL DOCTORS</Link></li>
          <li><Link to="/patient/about" className={isActive('/patient/about') ? 'active' : ''}>ABOUT</Link></li>
          <li><Link to="/patient/contact" className={isActive('/patient/contact') ? 'active' : ''}>CONTACT</Link></li>
          <li><Link to="/patient/appointments" className={isActive('/patient/appointments') ? 'active' : ''}>MY APPOINTMENTS</Link></li>
        </ul>

        {/* Right side */}
        <div className="navbar-right">
          {user ? (
            <div className="avatar-menu">
              <button
                className="avatar-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=5f6fff&color=fff`}
                  alt={user.name}
                  className="avatar-img"
                />
                <svg className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/patient/profile" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                  <Link to="/patient/appointments" onClick={() => setDropdownOpen(false)}>My Appointments</Link>
                  <div className="dropdown-divider" />
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth/login" className="btn-primary">Create account</Link>
          )}

          {/* Mobile hamburger */}
          <button className="menu-icon-btn" onClick={() => setMobileOpen(true)}>
            <img src={assets.menu_icon} alt="menu" style={{ width: 24 }} />
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="mobile-nav open">
          <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
            <img src={assets.cross_icon} alt="close" style={{ width: 20 }} />
          </button>
          <Link to="/patient/home" onClick={() => setMobileOpen(false)}>HOME</Link>
          <Link to="/patient/doctors" onClick={() => setMobileOpen(false)}>ALL DOCTORS</Link>
          <Link to="/patient/about" onClick={() => setMobileOpen(false)}>ABOUT</Link>
          <Link to="/patient/contact" onClick={() => setMobileOpen(false)}>CONTACT</Link>
          <Link to="/patient/appointments" onClick={() => setMobileOpen(false)}>MY APPOINTMENTS</Link>
          {user ? (
            <>
              <Link to="/patient/profile" onClick={() => setMobileOpen(false)}>My Profile</Link>
              <Link to="/patient/appointments" onClick={() => setMobileOpen(false)}>My Appointments</Link>
              <button style={{ padding: '12px 0', background: 'none', border: 'none', color: '#ef4444', fontSize: '1rem', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }} onClick={() => { setMobileOpen(false); handleLogout(); }}>Logout</button>
            </>
          ) : (
            <Link to="/auth/login" onClick={() => setMobileOpen(false)}>Create account</Link>
          )}
        </div>
      )}
    </>
  );
}
