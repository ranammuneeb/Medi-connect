import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { analyticsAPI } from '../../services/api';

const COLORS = ['#5f6fff', '#10b981', '#f59e0b', '#ef4444'];

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: '20px 24px',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    analyticsAPI.getAdminStats().then(setStats);
    analyticsAPI.getAppointmentsByDay().then(setDailyData);
    analyticsAPI.getRevenueByMonth().then(setRevenueData);
  }, []);

  const statCards = stats ? [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', bg: '#eef0ff', color: '#5f6fff' },
    { label: 'Total Patients', value: stats.totalPatients, icon: '🧑', bg: '#ecfdf5', color: '#10b981' },
    { label: 'Appointments', value: stats.totalAppointments, icon: '📅', bg: '#fffbeb', color: '#f59e0b' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: '💰', bg: '#fef2f2', color: '#ef4444' },
  ] : [];

  const pieData = stats ? [
    { name: 'Confirmed', value: stats.appointmentsByStatus.confirmed },
    { name: 'Pending', value: stats.appointmentsByStatus.pending },
    { name: 'Completed', value: stats.appointmentsByStatus.completed },
    { name: 'Cancelled', value: stats.appointmentsByStatus.cancelled },
  ] : [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {stats ? statCards.map((card) => (
            <div key={card.label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{card.label}</div>
              </div>
            </div>
          )) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 84, borderRadius: 12 }} />
            ))
          )}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Daily Appointments (This Week)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#5f6fff" radius={[6, 6, 0, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Appointment Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '0.78rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#5f6fff" strokeWidth={2.5} dot={{ fill: '#5f6fff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
