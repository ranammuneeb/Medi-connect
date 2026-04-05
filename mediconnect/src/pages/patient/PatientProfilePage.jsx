import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PatientNavbar from '../../components/common/PatientNavbar';
import { useAuth } from '../../context/AuthContext';

export default function PatientProfilePage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
      gender: user?.gender || '',
      address: user?.address || '',
      bloodGroup: user?.bloodGroup || '',
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser(data);
    toast.success('Profile updated successfully! ✅');
    setSaving(false);
  };

  return (
    <div>
      <PatientNavbar />

      <div style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem' }}>My Profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
            Manage your personal information
          </p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Avatar Card */}
          <div className="col-md-3">
            <div className="card p-4 text-center">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=128`}
                alt="Avatar"
                className="rounded-circle mx-auto mb-3"
                style={{ width: 100, height: 100, objectFit: 'cover', border: '3px solid #e0f2fe' }}
              />
              <h5 className="fw-bold mb-1">{user?.name}</h5>
              <span className="badge bg-primary">Patient</span>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.82rem' }}>
                Member since {user?.joinedDate || '—'}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="col-md-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card p-4"
            >
              <h5 className="fw-bold mb-4">📝 Personal Information</h5>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                      className="form-control"
                      placeholder="+1 (555) 000-0000"
                      {...register('phone')}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register('dob')}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender</label>
                    <select className="form-select" {...register('gender')}>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Blood Group</label>
                    <select className="form-select" {...register('bloodGroup')}>
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bg) => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Street, City, State, ZIP"
                      {...register('address')}
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    ) : '💾 Save Changes'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => window.location.reload()}>
                    Reset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
