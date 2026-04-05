import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import LandingNavbar from '../../components/common/LandingNavbar';
import { useAuth } from '../../context/AuthContext';
import { doctors, specialityData } from '../../assets/assets';

export default function DoctorListingPage() {
  const [searchParams] = useSearchParams();
  const [selectedSpeciality, setSelectedSpeciality] = useState(searchParams.get('speciality') || '');
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedSpeciality) {
      setFilteredDoctors(doctors.filter((d) => d.speciality === selectedSpeciality));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [selectedSpeciality]);

  const handleSpeciality = (spec) => {
    if (selectedSpeciality === spec) {
      setSelectedSpeciality('');
    } else {
      setSelectedSpeciality(spec);
    }
  };

  return (
    <div>
      {user ? <PatientNavbar /> : <LandingNavbar />}

      <div style={{ padding: '24px 40px', color: '#6b7280', fontSize: '0.9rem' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(user ? '/patient/home' : '/landing')}>Home</span>
        {' / '}
        <span>Doctors</span>
        {selectedSpeciality && <>{' / '}<span>{selectedSpeciality}</span></>}
      </div>

      <div className="listing-layout">
        {/* Sidebar */}
        <div className="listing-sidebar">
          <h3>Filters</h3>
          {specialityData.map((item) => (
            <button
              key={item.speciality}
              className={`filter-chip ${selectedSpeciality === item.speciality ? 'active' : ''}`}
              onClick={() => handleSpeciality(item.speciality)}
            >
              {item.speciality}
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

        {/* Doctor grid */}
        <div className="listing-content">
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: '0.9rem' }}>
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
            {selectedSpeciality ? ` for "${selectedSpeciality}"` : ''}
          </p>

          {filteredDoctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <h3 style={{ marginBottom: 8 }}>No doctors found</h3>
              <p>Try selecting a different speciality</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="doctor-card"
                  onClick={() => navigate(user ? `/patient/doctors/${doc._id}` : `/all-doctors/${doc._id}`)}
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
          )}
        </div>
      </div>
    </div>
  );
}
