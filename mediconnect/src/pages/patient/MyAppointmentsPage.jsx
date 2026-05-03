import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import { appointmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {

      const data = await appointmentsAPI.getAll({ patientId: user?._id });
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchAppointments();
  }, [user?._id]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentsAPI.cancel(id);
      fetchAppointments();
    } catch {
      alert('Failed to cancel appointment');
    }
  };

  const statusClass = {
    confirmed: 'status-confirmed',
    pending: 'status-pending',
    'in-progress': 'status-in-progress',
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
          <div className="text-center py-5 text-muted">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <h3 className="mb-2">No appointments yet</h3>
            <p>Book your first appointment with a trusted doctor.</p>
          </div>
        ) : (
          appointments.map((appt) => {
            const apptDate = new Date(appt.date);
            const isUpcoming = (appt.status === 'confirmed' || appt.status === 'pending') && apptDate >= now;
            return (
              <div key={appt._id} className="appt-card">
                {}
                <div style={{ flexShrink: 0 }}>
                  <img 
                    src={appt.doctorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctorName)}&background=5f6fff&color=fff&size=128&bold=true`} 
                    alt={appt.doctorName} 
                    style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', background: '#eef0ff' }} 
                  />
                </div>

                {}
                <div style={{ flex: 1 }}>
                  <div className="fw-semibold" style={{ fontSize: '0.95rem', marginBottom: 3 }}>{appt.doctorName}</div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>{appt.specialty}</div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
                    <strong>Date &amp; Time:</strong> {appt.date}, {appt.time}
                  </div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
                    <strong>Fee:</strong> ${appt.fee}
                  </div>
                </div>

                {}
                <div className="d-flex flex-column gap-2 align-items-end">
                  <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>
                    {appt.status}
                  </span>
                  {isUpcoming && (
                    <button
                      className="btn-outline"
                      style={{ fontSize: '0.82rem', padding: '6px 16px' }}
                      onClick={() => handleCancel(appt._id)}
                    >
                      Cancel appointment
                    </button>
                  )}
                  {appt.paymentStatus !== 'paid' && appt.status !== 'cancelled' && (
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '6px 16px' }}
                      onClick={() => navigate(`/patient/payment/${appt._id}`)}
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
