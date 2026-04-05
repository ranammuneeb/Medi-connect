import { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { doctorsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlotOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export default function DoctorProfileManagePage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({});

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [fee, setFee] = useState('');

  useEffect(() => {
    if (user?.doctorId) {
      doctorsAPI.getById(user.doctorId).then((doc) => {
        if (doc) {
          setPhone(doc.phone || '');
          setBio(doc.bio || '');
          setFee(doc.consultationFee || '');
          setAvailability(doc.availability || {});
        }
      });
    }
  }, [user?.doctorId]);

  const toggleSlot = (day, slot) => {
    setAvailability((prev) => {
      const current = prev[day] || [];
      const updated = current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot];
      return { ...prev, [day]: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user?.doctorId) {
        await doctorsAPI.update(user.doctorId, { phone, bio, consultationFee: fee, availability });
      }
      updateUser({ name });
      alert('Profile updated successfully!');
    } catch {
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="doctor-layout">
      <DoctorSidebar />
      <div className="doctor-content">
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Profile Settings</h1>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>Manage your professional information</p>
        </div>

        <form onSubmit={handleSave}>
          {/* Basic info */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Basic Information</h3>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Full Name</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Email</label>
                  <input className="form-control" style={{ background: '#f9fafb', color: '#9ca3af' }} value={user?.email || ''} readOnly />
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Phone</label>
                  <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Consultation Fee ($)</label>
                  <input className="form-control" type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Bio</label>
                  <textarea className="form-control" style={{ resize: 'vertical' }} rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h3 className="fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>Availability Schedule</h3>
              {days.map((day) => (
                <div key={day} className="mb-3">
                  <div className="fw-semibold mb-2" style={{ fontSize: '0.88rem', color: '#374151' }}>{day}</div>
                  <div className="d-flex flex-wrap gap-2">
                    {timeSlotOptions.map((slot) => {
                      const active = (availability[day] || []).includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleSlot(day, slot)}
                          style={{
                            padding: '6px 14px',
                            border: `1px solid ${active ? '#5f6fff' : '#e5e7eb'}`,
                            borderRadius: 50,
                            background: active ? '#5f6fff' : '#fff',
                            color: active ? '#fff' : '#6b7280',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            fontWeight: active ? 600 : 400,
                            transition: 'all 0.15s',
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn rounded" style={{ background: '#5f6fff', color: '#fff', border: 'none', padding: '10px 28px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
