import LandingNavbar from '../../components/common/LandingNavbar';
import { assets } from '../../assets/assets';

export default function PublicContactPage() {
  return (
    <div>
      <LandingNavbar />

      <div className="py-5 px-4">
        <p className="h4 fw-bold text-center">
          CONTACT <span style={{ color: '#5f6fff' }}>US</span>
        </p>

        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', marginTop: 32, flexWrap: 'wrap' }}>
          <img
            src={assets.contact_image}
            alt="Contact MediConnect"
            style={{ width: 300, borderRadius: 12, flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontWeight: 700, color: '#2d3748', marginBottom: 12, letterSpacing: 0.5 }}>OUR OFFICE</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 4 }}>kot abdul malik</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 16 }}>lahore, pakistan</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 4 }}>Tel: (415) 555-0132</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 32 }}>
              Email: <a href="mailto:rana@gmail.com" style={{ color: '#5f6fff' }}>rana@gmail.com</a>
            </p>

            <p style={{ fontWeight: 700, color: '#2d3748', marginBottom: 8, letterSpacing: 0.5 }}>CAREERS AT MEDICONNECT</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 20 }}>
              Learn more about our teams and job openings.
            </p>
            <button className="btn btn-outline-primary rounded-pill" style={{ borderColor: '#5f6fff', color: '#5f6fff' }}>Explore Jobs</button>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={assets.logo} alt="MediConnect" style={{ height: 44, width: 300, display: 'block' }} />
            </div>
            <p className="footer-desc">
              Your trusted platform for booking appointments with top doctors.
              Fast, simple, and secure — all in one place.
            </p>
          </div>
          <div className="footer-col">
            <h4>COMPANY</h4>
            <ul>
              <li><a href="/landing">Home</a></li>
              <li><a href="/about">About us</a></li>
              <li><a href="/all-doctors">All Doctors</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>GET IN TOUCH</h4>
            <ul>
              <li><a href="tel:+00000000000">+0-000-000-0000</a></li>
              <li><a href="mailto:rana@gmail.com">rana@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          Copyright © 2024 MediConnect - All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
