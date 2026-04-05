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
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>My Appointments</h1>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>{appointments.length} total appointments</p>
        </div>

        {/* Filters */}
        <div className="d-flex gap-3 mb-3 flex-wrap">
          <input
            className="form-control"
            style={{ width: 260 }}
            placeholder="Search patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0" style={{ fontSize: '0.88rem' }}>
                <thead className="table-light">
                  <tr>
                    {['#', 'Patient', 'Date & Time', 'Fee', 'Payment', 'Status', 'Update'].map((h) => (
                      <th key={h} style={{ fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={7}><div className="skeleton" style={{ height: 20, borderRadius: 4 }} /></td></tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-4 text-muted">No appointments found</td></tr>
                  ) : filtered.map((appt, i) => (
                    <tr key={appt.id}>
                      <td className="text-muted">{i + 1}</td>
                      <td className="fw-medium">{appt.patientName}</td>
                      <td className="text-muted">{appt.date} · {appt.time}</td>
                      <td className="fw-semibold" style={{ color: '#5f6fff' }}>${appt.fee}</td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: appt.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 500 }}>
                          {appt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass[appt.status] || 'status-pending'}`}>{appt.status}</span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ fontSize: '0.82rem' }}
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
      </div>
    </div>
  );
}
