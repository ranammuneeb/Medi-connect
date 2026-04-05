import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PatientNavbar from '../../components/common/PatientNavbar';
import { doctorsAPI } from '../../services/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorsAPI.getById(id),
  });

  if (isLoading) {
    return (
      <div>
        <PatientNavbar />
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
            </div>
            <div className="col-md-8">
              <div className="skeleton mb-3" style={{ height: 40, width: '50%' }} />
              <div className="skeleton mb-2" style={{ height: 24, width: '30%' }} />
              <div className="skeleton mb-2" style={{ height: 80 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) return <div className="container py-5 text-center"><h3>Doctor not found</h3></div>;

  return (
    <div>
      <PatientNavbar />

      {/* Breadcrumb */}
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><span className="text-primary cursor-pointer" onClick={() => navigate('/patient/doctors')}>Doctors</span></li>
            <li className="breadcrumb-item active">{doctor.name}</li>
          </ol>
        </nav>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {/* Sidebar Profile Card */}
          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card text-center p-4 sticky-top"
              style={{ top: 80 }}
            >
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="rounded-circle mx-auto mb-3"
                style={{ width: 130, height: 130, objectFit: 'cover', border: '4px solid #e0f2fe' }}
              />
              <span className="specialty-chip mb-2">{doctor.specialty}</span>
              <h4 className="fw-bold mt-2 mb-1">{doctor.name}</h4>
              <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                📍 {doctor.location}
              </p>
              <div className="d-flex justify-content-center gap-3 my-3">
                <div className="text-center">
                  <div className="fw-bold" style={{ color: '#0d6efd', fontSize: '1.3rem' }}>{doctor.rating}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Rating ⭐</div>
                </div>
                <div className="text-center">
                  <div className="fw-bold" style={{ color: '#0d6efd', fontSize: '1.3rem' }}>{doctor.experience}+</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Years Exp</div>
                </div>
                <div className="text-center">
                  <div className="fw-bold" style={{ color: '#0d6efd', fontSize: '1.3rem' }}>${doctor.consultationFee}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Per Visit</div>
                </div>
              </div>
              <div className="text-start mb-3" style={{ fontSize: '0.88rem', color: '#6c757d' }}>
                <div className="mb-1"><strong>📞</strong> {doctor.phone}</div>
                <div className="mb-1"><strong>✉️</strong> {doctor.email}</div>
                <div><strong>🎓</strong> {doctor.education}</div>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate(`/patient/book/${doctor.id}`)}
              >
                📅 Book Appointment
              </button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="col-md-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* About */}
              <div className="card p-4 mb-4">
                <h5 className="fw-bold mb-3">About Dr. {doctor.name.replace('Dr. ', '')}</h5>
                <p className="text-muted">{doctor.bio}</p>
                <div className="row mt-3 g-2">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ background: '#f0f7ff' }}>
                      <span>🏥</span>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#6c757d' }}>License Number</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{doctor.licenseNumber}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ background: '#f0fdf4' }}>
                      <span>📅</span>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#6c757d' }}>Joined Platform</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{doctor.joinedDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="card p-4">
                <h5 className="fw-bold mb-4">📅 Weekly Availability</h5>
                <div className="table-responsive">
                  <table className="table table-custom">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Available Time Slots</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((day) => (
                        <tr key={day}>
                          <td className="fw-semibold">{day}</td>
                          <td>
                            {doctor.availability?.[day]?.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {doctor.availability[day].map((slot) => (
                                  <span key={slot} className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 500 }}>
                                    {slot}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Not available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/patient/book/${doctor.id}`)}
                  >
                    📅 Book an Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
