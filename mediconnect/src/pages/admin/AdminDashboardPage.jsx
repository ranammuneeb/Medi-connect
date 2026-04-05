import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { SkeletonStat } from '../../components/common/SkeletonCard';
import { analyticsAPI } from '../../services/api';

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545'];

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: analyticsAPI.getAdminStats,
  });
  const { data: dailyData = [] } = useQuery({
    queryKey: ['admin', 'daily'],
    queryFn: analyticsAPI.getAppointmentsByDay,
  });
  const { data: revenueData = [] } = useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: analyticsAPI.getRevenueByMonth,
  });

  const statCards = stats ? [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', color: 'bg-primary' },
    { label: 'Total Patients', value: stats.totalPatients, icon: '🧑', color: 'bg-success' },
    { label: 'Appointments', value: stats.totalAppointments, icon: '📅', color: 'bg-warning' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-info' },
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
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d6efd 100%)', padding: '24px 32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0, fontSize: '0.9rem' }}>
            Welcome back, Admin • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="p-4">
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {statsLoading ? (
              <SkeletonStat count={4} />
            ) : statCards.map((card, i) => (
              <div key={card.label} className="col-6 col-lg-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`stat-card ${card.color}`}
                >
                  <div className="icon">{card.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{card.value}</div>
                  <div style={{ opacity: 0.85, fontSize: '0.9rem' }}>{card.label}</div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="row g-4 mb-4">
            <div className="col-md-8">
              <div className="card p-4">
                <h5 className="fw-bold mb-4">📊 Daily Appointments (This Week)</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0d6efd" radius={[6, 6, 0, 0]} name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4">
                <h5 className="fw-bold mb-4">📋 Appointment Status</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card p-4">
                <h5 className="fw-bold mb-4">💰 Monthly Revenue Trend</h5>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
                    <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#0d6efd" strokeWidth={3} dot={{ fill: '#0d6efd', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
