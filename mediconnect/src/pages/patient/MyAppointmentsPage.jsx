import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import PatientNavbar from '../../components/common/PatientNavbar';
import { appointmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { queryClient } from '../../lib/queryClient';

const tabs = ['upcoming', 'completed', 'cancelled'];
const statusColors = {
  confirmed: 'badge-confirmed',
  pending: 'badge-pending',
  cancelled: 'badge-cancelled',
  completed: 'badge-completed',
};

export default function MyAppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { user } = useAuth();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: () => appointmentsAPI.getAll({ patientId: user?.id }),
    enabled: !!user?.id,
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: (id) => appointmentsAPI.cancel(id),
    onSuccess: () => {
      toast.success('Appointment cancelled');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: () => toast.error('Failed to cancel appointment'),
  });

  const now = new Date();
  const filtered = appointments.filter((a) => {
    const apptDate = new Date(a.date);
    if (activeTab === 'upcoming') return (a.status === 'confirmed' || a.status === 'pending') && apptDate >= now;
    if (activeTab === 'completed') return a.status === 'completed' || apptDate < now;
    if (activeTab === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  return (
    <div>
      <PatientNavbar />

      <div style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem' }}>My Appointments</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
            Total: {appointments.length} appointments
          </p>
        </div>
      </div>

      <div className="container py-4">
        {/* Tabs */}
        <div className="d-flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ textTransform: 'capitalize', borderRadius: 8 }}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({appointments.filter((a) => {
                const d = new Date(a.date);
                if (tab === 'upcoming') return (a.status === 'confirmed' || a.status === 'pending') && d >= now;
                if (tab === 'completed') return a.status === 'completed' || d < now;
                return a.status === tab;
              }).length})
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-2 text-muted">Loading appointments...</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!isLoading && filtered.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '4rem' }}>📭</div>
                <h4 className="text-muted mt-3">No {activeTab} appointments</h4>
                <p className="text-muted">
                  {activeTab === 'upcoming' ? "You don't have any upcoming appointments." :
                    activeTab === 'completed' ? 'No completed appointments yet.' :
                      'No cancelled appointments.'}
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {filtered.map((appt) => (
                  <div key={appt.id} className="col-12">
                    <div className="card p-4">
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                        <div className="d-flex gap-3">
                          <div style={{
                            width: 60, height: 60, borderRadius: 12,
                            background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: '1.5rem', flexShrink: 0,
                          }}>
                            👨‍⚕️
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1">{appt.doctorName}</h5>
                            <p className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>
                              🏥 {appt.specialty}
                            </p>
                            <p className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>
                              📅 {appt.date} • ⏰ {appt.time}
                            </p>
                            {appt.symptoms && (
                              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                                📝 {appt.symptoms}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-2">
                          <span className={`badge-status ${statusColors[appt.status] || 'badge-pending'}`}>
                            {appt.status}
                          </span>
                          <div className="fw-bold text-primary">${appt.fee}</div>
                          <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                            {appt.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                          </span>
                          {(appt.status === 'confirmed' || appt.status === 'pending') &&
                            new Date(appt.date) >= now && (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  if (window.confirm('Cancel this appointment?')) {
                                    cancelAppointment(appt.id);
                                  }
                                }}
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
