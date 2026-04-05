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

      <div style={{ padding: '32px 40px', maxWidth: 860, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>My appointments</h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: 28 }}>
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
            Loading...
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <h3 style={{ marginBottom: 8 }}>No appointments yet</h3>
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
                  <img src={docImage} alt={appt.doctorName} className="appt-doctor-img" />
                ) : (
                  <div className="appt-doctor-img" style={{ background: '#eef0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    👨‍⚕️
                  </div>
                )}

                {/* Info */}
                <div className="appt-info">
                  <div className="appt-name">{appt.doctorName}</div>
                  <div className="appt-meta">{appt.specialty}</div>
                  <div className="appt-meta" style={{ marginTop: 4 }}>
                    <strong>Date & Time:</strong> {appt.date}, {appt.time}
                  </div>
                  <div className="appt-meta" style={{ marginTop: 4 }}>
                    <strong>Address:</strong> 17th Cross, Richmond Circle, Ring Road, London
                  </div>
                </div>

                {/* Actions */}
                <div className="appt-actions">
                  <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>
                    {appt.status}
                  </span>
                  {isUpcoming && (
                    <button className="btn-cancel" onClick={() => handleCancel(appt.id)}>
                      Cancel appointment
                    </button>
                  )}
                  {appt.paymentStatus !== 'paid' && appt.status !== 'cancelled' && (
                    <button className="btn-pay" onClick={() => alert('Payment flow coming soon')}>
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
