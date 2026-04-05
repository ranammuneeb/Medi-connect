import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { appointmentsAPI, analyticsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statusClass = { confirmed: 'status-confirmed', pending: 'status-pending', cancelled: 'status-cancelled', completed: 'status-completed' };

const cardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 };

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
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>
            Welcome back, {user?.name} · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Today */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Today's Appointments</h3>
            {todayAppts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af' }}>No appointments today</div>
            ) : todayAppts.map((appt) => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: 8, marginBottom: 8, fontSize: '0.88rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{appt.patientName}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{appt.time}</div>
                </div>
                <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>{appt.status}</span>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Upcoming Appointments</h3>
            {upcomingAppts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af' }}>No upcoming appointments</div>
            ) : upcomingAppts.slice(0, 5).map((appt) => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: 8, marginBottom: 8, fontSize: '0.88rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{appt.patientName}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{appt.date} · {appt.time}</div>
                </div>
                <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>{appt.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Weekly Appointment Volume</h3>
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
  );
}
