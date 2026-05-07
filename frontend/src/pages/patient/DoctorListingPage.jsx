import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import LandingNavbar from '../../components/common/LandingNavbar';
import { useAuth } from '../../context/AuthContext';
import { doctorsAPI, specialties } from '../../services/api';

const initialsAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'D')}&background=5f6fff&color=fff&size=128&bold=true`;

export default function DoctorListingPage() {
  const [searchParams] = useSearchParams();
  const [selectedSpeciality, setSelectedSpeciality] = useState(searchParams.get('speciality') || '');
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();


  useEffect(() => {
    setLoading(true);
    doctorsAPI.getAll()
      .then((data) => {
        setAllDoctors(data);
        setFilteredDoctors(data);
      })
      .catch(() => { setAllDoctors([]); setFilteredDoctors([]); })
      .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    if (selectedSpeciality) {
      setFilteredDoctors(allDoctors.filter((d) => d.specialty === selectedSpeciality));
    } else {
      setFilteredDoctors(allDoctors);
    }
  }, [selectedSpeciality, allDoctors]);

  const handleSpeciality = (spec) => {
    setSelectedSpeciality((prev) => (prev === spec ? '' : spec));
  };

  return (
    <div>
      {user ? <PatientNavbar /> : <LandingNavbar />}

      <div className="px-4 py-3" style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(user ? '/patient/home' : '/landing')}>Home</span>
        {' / '}
        <span>Doctors</span>
        {selectedSpeciality && <>{' / '}<span>{selectedSpeciality}</span></>}
      </div>

      <div className="listing-layout">
        {}
        <div className="listing-sidebar">
          <h3>Filters</h3>
          {specialties.map((spec) => (
            <button
              key={spec}
              className={`filter-chip ${selectedSpeciality === spec ? 'active' : ''}`}
              onClick={() => handleSpeciality(spec)}
            >
              {spec}
            </button>
          ))}
          {selectedSpeciality && (
            <button
              className="filter-chip"
              style={{ color: '#ef4444', borderColor: '#ef4444', marginTop: 8 }}
              onClick={() => setSelectedSpeciality('')}
            >
              Clear filter
            </button>
          )}
        </div>

        {}
        <div className="listing-content">
          <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            {loading ? 'Loading doctors...' : `${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? 's' : ''} found${selectedSpeciality ? ` for "${selectedSpeciality}"` : ''}`}
          </p>

          {!loading && filteredDoctors.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <h3 className="mb-2">No doctors found</h3>
              <p>Try selecting a different speciality</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="doctor-card"
                  onClick={() => navigate(user ? `/patient/book/${doc._id}` : `/all-doctors/${doc._id}`)}
                >
                  <img
                    src={doc.avatar || initialsAvatar(doc.name)}
                    alt={doc.name}
                    className="doctor-card-img"
                  />
                  <div className="doctor-card-body">
                    <div className="available-dot">Available</div>
                    <div className="doctor-card-name">{doc.name}</div>
                    <div className="doctor-card-specialty">{doc.specialty}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
