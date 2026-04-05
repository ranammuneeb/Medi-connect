import { useNavigate } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import { assets, specialityData, doctors } from '../../assets/assets';

export default function HomePage() {
  const navigate = useNavigate();

  const topDoctors = doctors.slice(0, 10);

  return (
    <div>
      <PatientNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="hero">
        <div className="hero-text">
          <div className="hero-badges">
            <div className="hero-badge">
              <img src={assets.group_profiles} alt="" style={{ height: 28 }} />
              100+ Doctors
            </div>
          </div>
          <h1>
            Book Appointment<br />
            With <span>Trusted Doctors</span>
          </h1>
          <p>
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </p>
          <a href="#speciality" className="btn rounded-pill" style={{ background: '#5f6fff', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Book appointment
            <img src={assets.arrow_icon} alt="" style={{ width: 16 }} />
          </a>
        </div>
        <div className="hero-image">
          <img src={assets.header_img} alt="Doctors" />
        </div>
      </div>

      {/* ── Speciality ────────────────────────────────────────────────────── */}
      <div className="py-5 px-4 text-center" id="speciality">
        <p className="h4 fw-bold">Find by Speciality</p>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: 480 }}>
          Simply browse through our extensive list of trusted doctors, schedule
          your appointment hassle-free.
        </p>
        <div className="speciality-grid" style={{ justifyContent: 'center' }}>
          {specialityData.map((item) => (
            <div
              key={item.speciality}
              className="speciality-card"
              onClick={() => navigate(`/patient/doctors?speciality=${item.speciality}`)}
            >
              <img src={item.image} alt={item.speciality} />
              <span>{item.speciality}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Doctors ───────────────────────────────────────────────────── */}
      <div className="py-5 px-4 text-center" style={{ background: '#f9fafb' }}>
        <p className="h4 fw-bold">Top Doctors to Book</p>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: 480 }}>
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="doctors-grid">
          {topDoctors.map((doc) => (
            <div
              key={doc._id}
              className="doctor-card"
              onClick={() => navigate(`/patient/doctors/${doc._id}`)}
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="doctor-card-img"
              />
              <div className="doctor-card-body">
                <div className="available-dot">Available</div>
                <div className="doctor-card-name">{doc.name}</div>
                <div className="doctor-card-specialty">{doc.speciality}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary rounded-pill" style={{ borderColor: '#5f6fff', color: '#5f6fff' }} onClick={() => navigate('/patient/doctors')}>
            more
          </button>
        </div>
      </div>

      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #5f6fff 0%, #8b9bff 100%)',
        margin: '0 40px 60px',
        borderRadius: 20,
        padding: '48px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        overflow: 'hidden',
      }}>
        <div style={{ color: '#fff', maxWidth: 400 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            Book Appointment<br />With 100+ Trusted Doctors on MediConnect
          </h2>
          <button
            className="btn rounded-pill"
            style={{ background: '#fff', color: '#5f6fff', border: 'none' }}
            onClick={() => navigate('/patient/doctors')}
          >
            Create account
          </button>
        </div>
        <img
          src={assets.appointment_img}
          alt="appointment"
          style={{ height: 200, borderRadius: 12, flexShrink: 0 }}
        />
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img
                src={assets.logo}
                alt="MediConnect"
                style={{ height: 44, width:300, display: 'block' }}
              />
            </div>
            <p className="footer-desc">
              Your trusted platform for booking appointments with top doctors.
              Fast, simple, and secure — all in one place.
            </p>
          </div>
          <div className="footer-col">
            <h4>COMPANY</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About us</a></li>
              <li><a href="#">All Doctors</a></li>
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
