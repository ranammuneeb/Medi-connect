import { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { doctorsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlotOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.88rem', outline: 'none' };

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
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>Profile Settings</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Manage your professional information</p>
        </div>

        <form onSubmit={handleSave}>
          {/* Basic info */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Full Name</label>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Email</label>
                <input style={{ ...inputStyle, background: '#f9fafb', color: '#9ca3af' }} value={user?.email || ''} readOnly />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Phone</label>
                <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Consultation Fee ($)</label>
                <input style={inputStyle} type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Bio</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Availability Schedule</h3>
            {days.map((day) => (
              <div key={day} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>{day}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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

          <button type="submit" className="btn-primary" style={{ borderRadius: 8, padding: '10px 28px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
