import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { appointmentsAPI, analyticsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statusClass = { confirmed: 'status-confirmed', pending: 'status-pending', cancelled: 'status-cancelled', completed: 'status-completed' };

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const [allAppointments, setAllAppointments] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (user?.doctorId) {
      appointmentsAPI.getAll({ doctorId: user.doctorId }).then(setAllAppointments);
    }
    analyticsAPI.getAppointmentsByDay().then(setChartData);
  }, [user?.doctorId]);

  const todayAppts = allAppointments.filter((a) => a.date === today);
  const upcomingAppts = allAppointments.filter((a) => a.date > today);

  const stats = [
    { label: "Today's Appointments", value: todayAppts.length, icon: '📅', bg: '#eef0ff', color: '#5f6fff' },
    { label: 'Upcoming', value: upcomingAppts.length, icon: '🔜', bg: '#ecfdf5', color: '#10b981' },
    { label: 'Confirmed', value: allAppointments.filter((a) => a.status === 'confirmed').length, icon: '✅', bg: '#fffbeb', color: '#f59e0b' },
    { label: 'Total', value: allAppointments.length, icon: '📊', bg: '#fef2f2', color: '#ef4444' },
  ];

  return (
    <div className="doctor-layout">
      <DoctorSidebar />
      <div className="doctor-content">
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Dashboard</h1>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>
            Welcome back, {user?.name} · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="col-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>{s.label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3 mb-3">
          {/* Today */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Today's Appointments</h3>
                {todayAppts.length === 0 ? (
                  <div className="text-center py-4 text-muted">No appointments today</div>
                ) : todayAppts.map((appt) => (
                  <div key={appt.id} className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{ background: '#f9fafb', fontSize: '0.88rem' }}>
                    <div>
                      <div className="fw-semibold">{appt.patientName}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{appt.time}</div>
                    </div>
                    <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>{appt.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Upcoming Appointments</h3>
                {upcomingAppts.length === 0 ? (
                  <div className="text-center py-4 text-muted">No upcoming appointments</div>
                ) : upcomingAppts.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{ background: '#f9fafb', fontSize: '0.88rem' }}>
                    <div>
                      <div className="fw-semibold">{appt.patientName}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{appt.date} · {appt.time}</div>
                    </div>
                    <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>{appt.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Weekly Appointment Volume</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#5f6fff" radius={[6, 6, 0, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
