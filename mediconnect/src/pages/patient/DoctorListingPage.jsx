import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PatientNavbar from '../../components/common/PatientNavbar';
import SkeletonCard from '../../components/common/SkeletonCard';
import { doctorsAPI, specialties, locations } from '../../services/api';

export default function DoctorListingPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const { data: doctors = [], isLoading, refetch } = useQuery({
    queryKey: ['doctors', search, specialty, location],
    queryFn: () => doctorsAPI.getAll({ search, specialty, location }),
  });

  const handleReset = () => {
    setSearch('');
    setSpecialty('');
    setLocation('');
  };

  return (
    <div>
      <PatientNavbar />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: 6 }}>
            Find Your Doctor
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 0 }}>
            Browse {doctors.length}+ specialists across multiple disciplines
          </p>
        </div>
      </div>

      <div className="container py-4">
        {/* Filters */}
        <div className="card p-3 mb-4">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold mb-1">Search by Name</label>
              <input
                className="form-control"
                placeholder="🔍 Doctor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold mb-1">Specialty</label>
              <select className="form-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                <option value="">All Specialties</option>
                {specialties.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold mb-1">Location</label>
              <select className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">All Locations</option>
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(search || specialty || location) && (
          <div className="mb-3 d-flex gap-2 flex-wrap">
            {search && <span className="badge bg-primary">{search} ×</span>}
            {specialty && <span className="badge bg-info text-dark">{specialty} ×</span>}
            {location && <span className="badge bg-success">{location} ×</span>}
            <small className="text-muted align-self-center">({doctors.length} results)</small>
          </div>
        )}

        {/* Doctor Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {isLoading ? (
            <SkeletonCard count={6} />
          ) : doctors.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: '4rem' }}>🔍</div>
              <h4 className="text-muted">No doctors found</h4>
              <p className="text-muted">Try adjusting your search filters</p>
              <button className="btn btn-primary" onClick={handleReset}>Clear Filters</button>
            </div>
          ) : doctors.map((doc, i) => (
            <div key={doc.id} className="col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card h-100 doctor-card"
              >
                <img src={doc.avatar} alt={doc.name} className="card-img-top" style={{ height: 200, objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
                <div className="card-body">
                  <span className="specialty-chip mb-2 d-inline-block">{doc.specialty}</span>
                  <h5 className="fw-bold mb-1">{doc.name}</h5>
                  <p className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>
                    📍 {doc.location}
                  </p>
                  <p className="text-muted mb-2" style={{ fontSize: '0.88rem' }}>
                    🎓 {doc.education} • {doc.experience} yrs exp
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="rating-star fw-semibold">⭐ {doc.rating}</span>
                    <span className="fw-bold text-primary">${doc.consultationFee} / visit</span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 pb-3 d-flex gap-2">
                  <button
                    className="btn btn-outline-primary flex-1"
                    onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                    style={{ flex: 1 }}
                  >
                    View Profile
                  </button>
                  <button
                    className="btn btn-primary flex-1"
                    onClick={() => navigate(`/patient/book/${doc.id}`)}
                    style={{ flex: 1 }}
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
