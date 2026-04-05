import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

export default function LandingNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div className="container">
          {/* Brand */}
          <Link to="/landing" className="navbar-brand">
            <img src={assets.logo} alt="MediConnect" style={{ height: 36 }} />
          </Link>

          {/* Nav Links — centered */}
          <ul className="navbar-nav mx-auto d-none d-lg-flex flex-row gap-4">
            <li className="nav-item">
              <Link to="/landing" className={`nav-link${isActive('/landing') ? ' active fw-semibold' : ''}`} style={isActive('/landing') ? { color: '#5f6fff' } : {}}>HOME</Link>
            </li>
            <li className="nav-item">
              <Link to="/all-doctors" className={`nav-link${location.pathname.startsWith('/all-doctors') ? ' active fw-semibold' : ''}`} style={location.pathname.startsWith('/all-doctors') ? { color: '#5f6fff' } : {}}>ALL DOCTORS</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link${isActive('/about') ? ' active fw-semibold' : ''}`} style={isActive('/about') ? { color: '#5f6fff' } : {}}>ABOUT</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={`nav-link${isActive('/contact') ? ' active fw-semibold' : ''}`} style={isActive('/contact') ? { color: '#5f6fff' } : {}}>CONTACT</Link>
            </li>
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2">
            <Link to="/auth/login" className="btn rounded-pill d-none d-lg-inline-block" style={{ background: '#5f6fff', color: '#fff', border: 'none' }}>Create account</Link>
            <button className="menu-icon-btn d-lg-none" onClick={() => setMobileOpen(true)}>
              <img src={assets.menu_icon} alt="menu" style={{ width: 24 }} />
            </button>
          </div>
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
