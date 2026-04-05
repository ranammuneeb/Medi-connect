import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { doctorsAPI, specialties, locations } from '../../services/api';
import { queryClient } from '../../lib/queryClient';
import { SkeletonTable } from '../../components/common/SkeletonCard';

export default function ManageDoctorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [search, setSearch] = useState('');

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors', search],
    queryFn: () => doctorsAPI.getAll({ search }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { mutate: createDoctor, isPending: isCreating } = useMutation({
    mutationFn: doctorsAPI.create,
    onSuccess: () => {
      toast.success('Doctor added! ✅');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      handleClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateDoctor, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => doctorsAPI.update(id, data),
    onSuccess: () => {
      toast.success('Doctor updated! ✅');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      handleClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteDoctor } = useMutation({
    mutationFn: doctorsAPI.delete,
    onSuccess: () => {
      toast.success('Doctor removed');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleClose = () => { setShowModal(false); setEditingDoctor(null); reset(); };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    reset({
      name: doctor.name, specialty: doctor.specialty, location: doctor.location,
      experience: doctor.experience, consultationFee: doctor.consultationFee,
      email: doctor.email, phone: doctor.phone, education: doctor.education,
    });
    setShowModal(true);
  };

  const onSubmit = (data) => {
    if (editingDoctor) {
      updateDoctor({ id: editingDoctor.id, data });
    } else {
      createDoctor({
        ...data,
        rating: 4.5,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
        availability: {},
        licenseNumber: `LIC-${Date.now()}`,
        bio: data.bio || 'Experienced medical professional.',
        joinedDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d6efd 100%)', padding: '24px 32px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>Manage Doctors</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0, fontSize: '0.9rem' }}>
                {doctors.length} doctors registered
              </p>
            </div>
            <button className="btn btn-light fw-semibold" onClick={() => { setEditingDoctor(null); reset(); setShowModal(true); }}>
              + Add Doctor
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Search */}
          <div className="mb-4">
            <input
              className="form-control"
              placeholder="🔍 Search doctors by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </div>

          {/* Table */}
          <div className="card">
            <div className="table-responsive">
              {isLoading ? (
                <div className="p-4"><SkeletonTable rows={6} /></div>
              ) : (
                <table className="table table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Location</th>
                      <th>Experience</th>
                      <th>Fee</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={doc.avatar} alt={doc.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{doc.name}</div>
                              <div className="text-muted" style={{ fontSize: '0.78rem' }}>{doc.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="specialty-chip">{doc.specialty}</span></td>
                        <td className="text-muted">{doc.location}</td>
                        <td>{doc.experience} yrs</td>
                        <td className="fw-semibold text-primary">${doc.consultationFee}</td>
                        <td><span className="rating-star">⭐ {doc.rating}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(doc)}>Edit</button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => { if (window.confirm('Delete this doctor?')) deleteDoctor(doc.id); }}
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingDoctor ? '✏️ Edit Doctor' : '➕ Add New Doctor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="doctor-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name *</label>
                <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Dr. Jane Smith"
                  {...register('name', { required: 'Name is required' })} />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email *</label>
                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email', { required: 'Email is required' })} />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Specialty *</label>
                <select className={`form-select ${errors.specialty ? 'is-invalid' : ''}`}
                  {...register('specialty', { required: 'Specialty is required' })}>
                  <option value="">Select</option>
                  {specialties.map((s) => <option key={s}>{s}</option>)}
                </select>
                {errors.specialty && <div className="invalid-feedback">{errors.specialty.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Location *</label>
                <select className="form-select" {...register('location', { required: 'Location is required' })}>
                  <option value="">Select</option>
                  {locations.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Experience (yrs)</label>
                <input type="number" className="form-control" min={0} {...register('experience')} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Consultation Fee ($)</label>
                <input type="number" className="form-control" min={0} {...register('consultationFee')} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Phone</label>
                <input className="form-control" {...register('phone')} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Education</label>
                <input className="form-control" placeholder="Harvard Medical School" {...register('education')} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Bio</label>
                <textarea className="form-control" rows={2} {...register('bio')} />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="doctor-form" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : 'Save Doctor'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
