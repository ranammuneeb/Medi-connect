import { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { appointmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statusOptions = ['confirmed', 'pending', 'completed', 'cancelled'];
const statusClass = { confirmed: 'status-confirmed', pending: 'status-pending', cancelled: 'status-cancelled', completed: 'status-completed' };

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await appointmentsAPI.getAll({ doctorId: user?.doctorId });
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => { if (user?.doctorId) fetchAppointments(); }, [user?.doctorId]);

  const handleStatusChange = async (id, status) => {
    await appointmentsAPI.updateStatus(id, status);
    fetchAppointments();
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = !statusFilter || a.status === statusFilter;
    const matchSearch = !search || a.patientName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="doctor-layout">
      <DoctorSidebar />
      <div className="doctor-content">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>My Appointments</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>{appointments.length} total appointments</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.88rem', width: 260, outline: 'none' }}
            placeholder="Search patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.88rem', outline: 'none' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['#', 'Patient', 'Date & Time', 'Fee', 'Payment', 'Status', 'Update'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} style={{ padding: '12px 16px' }}><div className="skeleton" style={{ height: 20, borderRadius: 4 }} /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No appointments found</td></tr>
              ) : filtered.map((appt, i) => (
                <tr key={appt.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{appt.patientName}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{appt.date} · {appt.time}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#5f6fff' }}>${appt.fee}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.78rem', color: appt.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 500 }}>
                      {appt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>{appt.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      style={{ padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.82rem', outline: 'none' }}
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                    >
                      {statusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
