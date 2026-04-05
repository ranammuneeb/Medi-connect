import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PatientNavbar from '../../components/common/PatientNavbar';
import { doctorsAPI, specialties, locations } from '../../services/api';
import SkeletonCard from '../../components/common/SkeletonCard';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const navigate = useNavigate();

  const { data: featuredDoctors = [], isLoading } = useQuery({
    queryKey: ['doctors', 'featured'],
    queryFn: () => doctorsAPI.getAll(),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/patient/doctors?search=${search}&specialty=${specialty}`);
  };

  return (
    <div>
      <PatientNavbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
                  Your Health,<br />
                  <span style={{ color: '#bfdbfe' }}>Our Priority 💙</span>
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', maxWidth: 500 }}>
                  Book appointments with top doctors in your area. Fast, simple, and secure — all in one platform.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch}>
                  <div className="card p-3" style={{ borderRadius: 16 }}>
                    <div className="row g-2">
                      <div className="col-md-5">
                        <input
                          className="form-control"
                          placeholder="🔍 Search doctor by name..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <select className="form-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                          <option value="">All Specialties</option>
                          {specialties.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <button type="submit" className="btn btn-primary w-100">
                          Find Doctors
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-center mt-4 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ fontSize: '12rem', lineHeight: 1 }}
              >
                👩‍⚕️
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-4 bg-white shadow-sm">
        <div className="container">
          <div className="row text-center">
            {[
              { label: 'Expert Doctors', value: '500+', icon: '👨‍⚕️' },
              { label: 'Happy Patients', value: '10K+', icon: '😊' },
              { label: 'Specialties', value: '30+', icon: '🏥' },
              { label: 'Years Experience', value: '15+', icon: '⭐' },
            ].map((stat) => (
              <div key={stat.label} className="col-6 col-md-3 py-2">
                <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d6efd' }}>{stat.value}</div>
                <div className="text-muted" style={{ fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">Browse by Specialty</h2>
          <p className="section-subtitle text-center">Find the right doctor for your needs</p>
          <div className="row g-3 justify-content-center">
            {[
              { name: 'Cardiologist', icon: '❤️' },
              { name: 'Neurologist', icon: '🧠' },
              { name: 'Pediatrician', icon: '👶' },
              { name: 'Dermatologist', icon: '🔬' },
              { name: 'Psychiatrist', icon: '💭' },
              { name: 'Orthopedic Surgeon', icon: '🦴' },
            ].map((spec) => (
              <div key={spec.name} className="col-6 col-md-4 col-lg-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card text-center p-3 cursor-pointer"
                  style={{ borderRadius: 16 }}
                  onClick={() => navigate(`/patient/doctors?specialty=${spec.name}`)}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{spec.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{spec.name}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title mb-0">Top Doctors</h2>
              <p className="text-muted mb-0">Our most trusted specialists</p>
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/patient/doctors')}
            >
              View All →
            </button>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {isLoading
              ? <SkeletonCard count={3} />
              : featuredDoctors.slice(0, 3).map((doc, i) => (
                <div key={doc.id} className="col">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="card h-100 doctor-card cursor-pointer"
                    onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                  >
                    <img src={doc.avatar} alt={doc.name} className="card-img-top" />
                    <div className="card-body">
                      <span className="specialty-chip mb-2 d-inline-block">{doc.specialty}</span>
                      <h5 className="fw-bold mb-1">{doc.name}</h5>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        📍 {doc.location} • {doc.experience} yrs exp
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="rating-star fw-semibold">⭐ {doc.rating}</span>
                        <span className="fw-bold text-primary">${doc.consultationFee}</span>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent border-0 pb-3">
                      <button
                        className="btn btn-primary w-100"
                        onClick={(e) => { e.stopPropagation(); navigate(`/patient/book/${doc.id}`); }}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </motion.div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-subtitle text-center">Book your appointment in 3 simple steps</p>
          <div className="row g-4 justify-content-center">
            {[
              { step: '1', title: 'Search Doctor', desc: 'Find the right specialist by name, specialty, or location.', icon: '🔍' },
              { step: '2', title: 'Book Appointment', desc: 'Choose your preferred date and time slot.', icon: '📅' },
              { step: '3', title: 'Consult & Heal', desc: 'Visit the doctor and get the care you deserve.', icon: '💊' },
            ].map((item) => (
              <div key={item.step} className="col-md-4">
                <div className="card text-center p-4 h-100" style={{ border: '2px solid #e0f2fe' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>{item.icon}</div>
                  <div className="badge bg-primary rounded-circle mb-2" style={{ width: 32, height: 32, lineHeight: '32px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.step}
                  </div>
                  <h5 className="fw-bold mt-2">{item.title}</h5>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-muted" style={{ background: '#1e3a5f', color: '#fff' }}>
        <div className="container">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>🏥 MediConnect</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            © 2026 MediConnect. All rights reserved. | Your trusted healthcare platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
