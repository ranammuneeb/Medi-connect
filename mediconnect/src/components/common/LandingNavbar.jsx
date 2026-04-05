import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

export default function LandingNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        {/* Brand */}
        <Link to="/landing" className="navbar-brand">
          <img src={assets.logo} alt="MediConnect" style={{ height: 36 }} />
        </Link>

        {/* Nav Links */}
        <ul className="navbar-links">
          <li><Link to="/landing" className={isActive('/landing') ? 'active' : ''}>HOME</Link></li>
          <li><Link to="/all-doctors" className={location.pathname.startsWith('/all-doctors') ? 'active' : ''}>ALL DOCTORS</Link></li>
          <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>ABOUT</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>CONTACT</Link></li>
        </ul>

        {/* Right side */}
        <div className="navbar-right">
          <Link to="/auth/login" className="btn-primary">Create account</Link>
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
          <Link to="/landing" onClick={() => setMobileOpen(false)}>HOME</Link>
          <Link to="/all-doctors" onClick={() => setMobileOpen(false)}>ALL DOCTORS</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)}>ABOUT</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)}>CONTACT</Link>
          <Link to="/auth/login" onClick={() => setMobileOpen(false)}>Create account</Link>
        </div>
      )}
    </>
  );
}
