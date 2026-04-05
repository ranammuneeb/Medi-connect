import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { appointmentsAPI } from '../../services/api';

const statusOptions = ['', 'confirmed', 'pending', 'completed', 'cancelled'];
const statusClass = { confirmed: 'status-confirmed', pending: 'status-pending', cancelled: 'status-cancelled', completed: 'status-completed' };

export default function AppointmentsOverviewPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await appointmentsAPI.getAll();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatusChange = async (id, status) => {
    await appointmentsAPI.updateStatus(id, status);
    fetchAppointments();
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = !statusFilter || a.status === statusFilter;
    const matchSearch = !search ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>All Appointments</h1>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>{filtered.length} of {appointments.length} total</p>
        </div>

        {/* Filters */}
        <div className="d-flex gap-3 mb-3 flex-wrap">
          <input
            className="form-control"
            style={{ width: 280 }}
            placeholder="Search patient or doctor..."
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
            {statusOptions.slice(1).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0" style={{ fontSize: '0.88rem' }}>
                <thead className="table-light">
                  <tr>
                    {['Patient', 'Doctor', 'Specialty', 'Date & Time', 'Fee', 'Status', 'Update Status'].map((h) => (
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
                  ) : filtered.map((appt) => (
                    <tr key={appt.id}>
                      <td className="fw-medium">{appt.patientName}</td>
                      <td>{appt.doctorName}</td>
                      <td className="text-muted">{appt.specialty}</td>
                      <td className="text-muted">{appt.date} · {appt.time}</td>
                      <td className="fw-semibold" style={{ color: '#5f6fff' }}>${appt.fee}</td>
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
                          {statusOptions.slice(1).map((s) => <option key={s}>{s}</option>)}
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
