import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { analyticsAPI } from '../../services/api';

const COLORS = ['#5f6fff', '#10b981', '#f59e0b', '#ef4444'];

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
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Dashboard</h1>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {stats ? statCards.map((card) => (
            <div key={card.label} className="col-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{card.label}</div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="col-6 col-xl-3">
                <div className="skeleton" style={{ height: 84, borderRadius: 12 }} />
              </div>
            ))
          )}
        </div>

        {/* Charts row */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Daily Appointments (This Week)</h3>
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
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Appointment Status</h3>
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
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Monthly Revenue Trend</h3>
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
    </div>
  );
}
