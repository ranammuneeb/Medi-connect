import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { appointmentsAPI } from '../../services/api';
import { queryClient } from '../../lib/queryClient';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../components/common/SkeletonCard';

const statusOptions = ['confirmed', 'pending', 'completed', 'cancelled'];
const statusColors = {
  confirmed: 'badge-confirmed', pending: 'badge-pending',
  cancelled: 'badge-cancelled', completed: 'badge-completed',
};

export default function AppointmentsOverviewPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', 'admin'],
    queryFn: () => appointmentsAPI.getAll(),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => appointmentsAPI.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

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
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d6efd 100%)', padding: '24px 32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>All Appointments</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0, fontSize: '0.9rem' }}>
            {appointments.length} total appointments
          </p>
        </div>

        <div className="p-4">
          {/* Filters */}
          <div className="d-flex gap-3 flex-wrap mb-4">
            <input
              className="form-control"
              placeholder="🔍 Search patient or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 320 }}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ maxWidth: 200 }}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
            </select>
            {(statusFilter || search) && (
              <button className="btn btn-outline-secondary" onClick={() => { setStatusFilter(''); setSearch(''); }}>
                Reset
              </button>
            )}
            <span className="text-muted align-self-center">({filtered.length} results)</span>
          </div>

          <div className="card">
            <div className="table-responsive">
              {isLoading ? (
                <div className="p-4"><SkeletonTable rows={6} /></div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem' }}>📭</div>
                  <p className="text-muted mt-2">No appointments found</p>
                </div>
              ) : (
                <table className="table table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Date & Time</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((appt) => (
                      <tr key={appt.id}>
                        <td>
                          <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{appt.patientName}</div>
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>{appt.patientEmail}</div>
                        </td>
                        <td className="fw-semibold" style={{ fontSize: '0.9rem' }}>{appt.doctorName}</td>
                        <td><span className="specialty-chip" style={{ fontSize: '0.75rem' }}>{appt.specialty}</span></td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <div>{appt.date}</div>
                          <div className="text-muted">{appt.time}</div>
                        </td>
                        <td className="fw-semibold text-primary">${appt.fee}</td>
                        <td>
                          <span className={`badge-status ${statusColors[appt.status] || 'badge-pending'}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${appt.paymentStatus === 'paid' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.75rem' }}>
                            {appt.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={appt.status}
                            onChange={(e) => updateStatus({ id: appt.id, status: e.target.value })}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
