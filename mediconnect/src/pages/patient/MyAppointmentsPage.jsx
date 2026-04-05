import { useState, useEffect } from 'react';
import PatientNavbar from '../../components/common/PatientNavbar';
import { appointmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { doctors } from '../../assets/assets';

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentsAPI.getAll({ patientId: user?.id });
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAppointments();
  }, [user?.id]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentsAPI.cancel(id);
      fetchAppointments();
    } catch {
      alert('Failed to cancel appointment');
    }
  };

  // Find doctor image from assets
  const getDoctorImage = (doctorName) => {
    const match = doctors.find((d) => d.name === doctorName);
    return match ? match.image : null;
  };

  const statusClass = {
    confirmed: 'status-confirmed',
    pending: 'status-pending',
    cancelled: 'status-cancelled',
    completed: 'status-completed',
  };

  const now = new Date();

  return (
    <div>
      <PatientNavbar />

      <div className="px-4 py-4" style={{ maxWidth: 860, margin: '0 auto' }}>
        <h2 className="fw-bold mb-1" style={{ fontSize: '1.3rem' }}>My appointments</h2>
        <p className="text-muted mb-4" style={{ fontSize: '0.88rem' }}>
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="text-center py-5 text-muted">
            Loading...
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <h3 className="mb-2">No appointments yet</h3>
            <p>Book your first appointment with a trusted doctor.</p>
          </div>
        ) : (
          appointments.map((appt) => {
            const docImage = getDoctorImage(appt.doctorName);
            const apptDate = new Date(appt.date);
            const isUpcoming = (appt.status === 'confirmed' || appt.status === 'pending') && apptDate >= now;
            return (
              <div key={appt.id} className="appt-card">
                {/* Doctor image */}
                {docImage ? (
                  <img src={docImage} alt={appt.doctorName} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', background: '#eef0ff', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 8, background: '#eef0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    👨‍⚕️
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div className="fw-semibold" style={{ fontSize: '0.95rem', marginBottom: 3 }}>{appt.doctorName}</div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>{appt.specialty}</div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
                    <strong>Date &amp; Time:</strong> {appt.date}, {appt.time}
                  </div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
                    <strong>Address:</strong> 17th Cross, Richmond Circle, Ring Road, London
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex flex-column gap-2 align-items-end">
                  <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>
                    {appt.status}
                  </span>
                  {isUpcoming && (
                    <button
                      className="btn btn-sm rounded-pill"
                      style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#2d3748', fontSize: '0.82rem' }}
                      onClick={() => handleCancel(appt.id)}
                    >
                      Cancel appointment
                    </button>
                  )}
                  {appt.paymentStatus !== 'paid' && appt.status !== 'cancelled' && (
                    <button
                      className="btn btn-sm rounded-pill"
                      style={{ background: '#5f6fff', color: '#fff', border: 'none', fontSize: '0.82rem' }}
                      onClick={() => alert('Payment flow coming soon')}
                    >
                      Pay online
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
