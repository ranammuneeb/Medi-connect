import LandingNavbar from '../../components/common/LandingNavbar';
import { assets } from '../../assets/assets';

export default function PublicAboutPage() {
  return (
    <div>
      <LandingNavbar />

      <div className="py-5 px-4">
        <p className="h4 fw-bold text-center">
          ABOUT <span style={{ color: '#5f6fff' }}>US</span>
        </p>

        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', marginTop: 32, flexWrap: 'wrap' }}>
          <img
            src={assets.about_image}
            alt="About MediConnect"
            style={{ width: 300, borderRadius: 12, flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 16 }}>
              Welcome To MediConnect, Your Trusted Partner In Managing Your Healthcare Needs Conveniently And Efficiently.
              At MediConnect, We Understand The Challenges Individuals Face When It Comes To Scheduling Doctor
              Appointments And Managing Their Health Records.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 24 }}>
              MediConnect Is Committed To Excellence In Healthcare Technology. We Continuously Strive To Enhance Our
              Platform, Integrating The Latest Advancements To Improve User Experience And Deliver Superior Service.
              Whether You're Booking Your First Appointment Or Managing Ongoing Care, MediConnect Is Here To Support You
              Every Step Of The Way.
            </p>
            <p style={{ fontWeight: 700, color: '#2d3748', marginBottom: 8 }}>Our Vision</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
              Our Vision At MediConnect Is To Create A Seamless Healthcare Experience For Every User. We Aim To Bridge The
              Gap Between Patients And Healthcare Providers, Making It Easier For You To Access The Care You Need, When
              You Need It.
            </p>
          </div>
        </div>
      </div>

      <div className="py-5 px-4" style={{ background: '#f9fafb' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', color: '#2d3748', marginBottom: 24, letterSpacing: 1 }}>
          WHY <span style={{ color: '#5f6fff' }}>CHOOSE US</span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { title: 'EFFICIENCY:', desc: 'Streamlined Appointment Scheduling That Fits Into Your Busy Lifestyle.' },
            { title: 'CONVENIENCE:', desc: 'Access To A Network Of Trusted Healthcare Professionals In Your Area.' },
            { title: 'PERSONALIZATION:', desc: 'Tailored Recommendations And Reminders To Help You Stay On Top Of Your Health.' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '32px 24px',
                borderRight: i < 2 ? '1px solid #e5e7eb' : 'none',
                background: '#fff',
                transition: 'background 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#5f6fff';
                e.currentTarget.querySelectorAll('p').forEach(p => p.style.color = '#fff');
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.querySelectorAll('p').forEach((p, idx) => {
                  p.style.color = idx === 0 ? '#2d3748' : '#4b5563';
                });
              }}
            >
              <p style={{ fontWeight: 700, color: '#2d3748', marginBottom: 12 }}>{item.title}</p>
              <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.9rem' }}>{item.desc}</p>
            </div>
          ))}
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
