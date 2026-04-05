import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { appointmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { queryClient } from '../../lib/queryClient';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../components/common/SkeletonCard';

const statusOptions = ['confirmed', 'pending', 'completed', 'cancelled'];
const statusColors = {
  confirmed: 'badge-confirmed', pending: 'badge-pending',
  cancelled: 'badge-cancelled', completed: 'badge-completed',
};

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['doctor-appointments', user?.doctorId],
    queryFn: () => appointmentsAPI.getAll({ doctorId: user?.doctorId }),
    enabled: !!user?.doctorId,
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => appointmentsAPI.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const filtered = appointments.filter((a) => {
    const matchStatus = !statusFilter || a.status === statusFilter;
    const matchSearch = !search || a.patientName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="admin-layout">
      <DoctorSidebar />
      <div className="doctor-content">
        <div style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)', padding: '24px 32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>My Appointments</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>
            {appointments.length} total appointments
          </p>
        </div>

        <div className="p-4">
          {/* Filters */}
          <div className="d-flex gap-3 flex-wrap mb-4">
            <input
              className="form-control"
              placeholder="🔍 Search patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 180 }}>
              <option value="">All Statuses</option>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
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
                <div className="p-4"><SkeletonTable rows={5} /></div>
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
                      <th>Date & Time</th>
                      <th>Symptoms</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((appt) => (
                      <tr key={appt.id}>
                        <td>
                          <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{appt.patientName}</div>
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>{appt.patientPhone}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.88rem' }}>{appt.date}</div>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>⏰ {appt.time}</div>
                        </td>
                        <td className="text-muted" style={{ fontSize: '0.85rem', maxWidth: 200 }}>
                          {appt.symptoms || '—'}
                        </td>
                        <td className="fw-semibold text-primary">${appt.fee}</td>
                        <td>
                          <span className={`badge-status ${statusColors[appt.status]}`}>{appt.status}</span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={appt.status}
                            onChange={(e) => updateStatus({ id: appt.id, status: e.target.value })}
                            style={{ width: 'auto' }}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
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
