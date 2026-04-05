import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { appointmentsAPI, analyticsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SkeletonStat } from '../../components/common/SkeletonCard';
import { format } from 'date-fns';

const statusColors = {
  confirmed: 'badge-confirmed', pending: 'badge-pending',
  cancelled: 'badge-cancelled', completed: 'badge-completed',
};

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: allAppointments = [], isLoading } = useQuery({
    queryKey: ['doctor-appointments', user?.doctorId],
    queryFn: () => appointmentsAPI.getAll({ doctorId: user?.doctorId }),
    enabled: !!user?.doctorId,
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ['admin', 'daily'],
    queryFn: analyticsAPI.getAppointmentsByDay,
  });

  const todayAppts = allAppointments.filter((a) => a.date === today);
  const upcomingAppts = allAppointments.filter((a) => new Date(a.date) > new Date(today));
  const confirmedAppts = allAppointments.filter((a) => a.status === 'confirmed');

  const stats = [
    { label: "Today's Appointments", value: todayAppts.length, icon: '📅', color: 'bg-primary' },
    { label: 'Upcoming', value: upcomingAppts.length, icon: '🔜', color: 'bg-success' },
    { label: 'Confirmed', value: confirmedAppts.length, icon: '✅', color: 'bg-info' },
    { label: 'Total Appointments', value: allAppointments.length, icon: '📊', color: 'bg-warning' },
  ];

  return (
    <div className="admin-layout">
      <DoctorSidebar />
      <div className="doctor-content">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)', padding: '24px 32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>
            Doctor Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0, fontSize: '0.9rem' }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • Welcome, {user?.name}
          </p>
        </div>

        <div className="p-4">
          {/* Stats */}
          <div className="row g-3 mb-4">
            {isLoading ? (
              <SkeletonStat count={4} />
            ) : stats.map((stat, i) => (
              <div key={stat.label} className="col-6 col-lg-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`stat-card ${stat.color}`}
                >
                  <div className="icon">{stat.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.value}</div>
                  <div style={{ opacity: 0.85, fontSize: '0.9rem' }}>{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            {/* Today's Appointments */}
            <div className="col-md-6">
              <div className="card p-4 h-100">
                <h5 className="fw-bold mb-3">📅 Today's Appointments</h5>
                {todayAppts.length === 0 ? (
                  <div className="text-center py-4">
                    <div style={{ fontSize: '3rem' }}>🎉</div>
                    <p className="text-muted mt-2">No appointments today</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {todayAppts.map((appt) => (
                      <div key={appt.id} className="d-flex justify-content-between align-items-center p-2 rounded"
                        style={{ background: '#f8f9fa' }}>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{appt.patientName}</div>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>⏰ {appt.time}</div>
                        </div>
                        <span className={`badge-status ${statusColors[appt.status]}`}>{appt.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming */}
            <div className="col-md-6">
              <div className="card p-4 h-100">
                <h5 className="fw-bold mb-3">🔜 Upcoming Appointments</h5>
                {upcomingAppts.length === 0 ? (
                  <div className="text-center py-4">
                    <div style={{ fontSize: '3rem' }}>📭</div>
                    <p className="text-muted mt-2">No upcoming appointments</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {upcomingAppts.slice(0, 5).map((appt) => (
                      <div key={appt.id} className="d-flex justify-content-between align-items-center p-2 rounded"
                        style={{ background: '#f8f9fa' }}>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{appt.patientName}</div>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>📅 {appt.date} • {appt.time}</div>
                        </div>
                        <span className={`badge-status ${statusColors[appt.status]}`}>{appt.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="col-12">
              <div className="card p-4">
                <h5 className="fw-bold mb-4">📊 Weekly Appointment Volume</h5>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
