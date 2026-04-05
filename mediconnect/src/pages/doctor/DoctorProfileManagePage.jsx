import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { doctorsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlotOptions = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

export default function DoctorProfileManagePage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({});

  const { data: doctorProfile, isLoading } = useQuery({
    queryKey: ['doctorProfile', user?.doctorId],
    queryFn: () => doctorsAPI.getById(user?.doctorId),
    enabled: !!user?.doctorId,
    onSuccess: (data) => {
      if (data?.availability) setAvailability(data.availability);
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: doctorProfile?.phone || '',
      bio: doctorProfile?.bio || '',
      consultationFee: doctorProfile?.consultationFee || '',
    },
  });

  const toggleSlot = (day, slot) => {
    setAvailability((prev) => {
      const current = prev[day] || [];
      const updated = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [day]: updated };
    });
  };

  const onSubmit = async (data) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (user?.doctorId) {
      await doctorsAPI.update(user.doctorId, { ...data, availability });
    }
    updateUser({ name: data.name });
    toast.success('Profile updated! ✅');
    setSaving(false);
  };

  if (isLoading) {
    return (
      <div className="admin-layout">
        <DoctorSidebar />
        <div className="doctor-content p-4">
          <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <DoctorSidebar />
      <div className="doctor-content">
        <div style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)', padding: '24px 32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>My Profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>Manage your profile and availability</p>
        </div>

        <div className="p-4">
          <div className="row g-4">
            {/* Profile Card */}
            <div className="col-md-3">
              <div className="card p-4 text-center">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr')}&size=128`}
                  alt="Avatar"
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: 100, height: 100, objectFit: 'cover', border: '3px solid #ccfbf1' }}
                />
                <h5 className="fw-bold mb-1">{user?.name}</h5>
                <span className="badge" style={{ background: '#0f766e', color: '#fff' }}>
                  {doctorProfile?.specialty || 'Doctor'}
                </span>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.82rem' }}>
                  ⭐ {doctorProfile?.rating} • {doctorProfile?.experience} yrs exp
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="col-md-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="card p-4 mb-4">
                    <h5 className="fw-bold mb-4">📝 Personal Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Full Name *</label>
                        <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          {...register('name', { required: 'Name is required' })} />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <input type="email" className="form-control" {...register('email')} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Phone</label>
                        <input className="form-control" placeholder="+1 (555) 000-0000" {...register('phone')} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Consultation Fee ($)</label>
                        <input type="number" className="form-control" {...register('consultationFee')} />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Bio / About</label>
                        <textarea className="form-control" rows={3}
                          placeholder="Describe your expertise and approach..."
                          {...register('bio')} />
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="card p-4 mb-4">
                    <h5 className="fw-bold mb-4">📅 Weekly Availability</h5>
                    <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                      Click time slots to toggle availability for each day.
                    </p>
                    {days.map((day) => (
                      <div key={day} className="mb-3">
                        <div className="fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>{day}</div>
                        <div className="d-flex flex-wrap">
                          {timeSlotOptions.map((slot) => {
                            const isSelected = (availability[day] || []).includes(slot);
                            return (
                              <button
                                key={slot}
                                type="button"
                                className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleSlot(day, slot)}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                      {saving ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                      ) : '💾 Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
