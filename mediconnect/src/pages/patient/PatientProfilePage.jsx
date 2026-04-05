import { useState } from 'react';
import PatientNavbar from '../../components/common/PatientNavbar';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

export default function PatientProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address1, setAddress1] = useState(user?.address1 || '');
  const [address2, setAddress2] = useState(user?.address2 || '');
  const [gender, setGender] = useState(user?.gender || 'Not Selected');
  const [dob, setDob] = useState(user?.dob || '');

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateUser({ name, phone, address1, address2, gender, dob });
    setIsEdit(false);
    setSaving(false);
  };

  return (
    <div>
      <PatientNavbar />

      <div className="profile-form-page">
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 32 }}>
          <div style={{ position: 'relative' }}>
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=5f6fff&color=fff&size=128`}
              alt={user?.name}
              style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', background: '#eef0ff' }}
            />
            {isEdit && (
              <label style={{
                position: 'absolute', bottom: 0, right: 0,
                background: '#5f6fff', color: '#fff', borderRadius: '50%',
                width: 28, height: 28, display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem',
              }}>
                <img src={assets.upload_icon} alt="upload" style={{ width: 14, filter: 'brightness(10)' }} />
              </label>
            )}
          </div>
          <div>
            {isEdit ? (
              <input
                className="form-input"
                style={{ fontSize: '1.2rem', fontWeight: 700, border: 'none', borderBottom: '2px solid #5f6fff', borderRadius: 0, padding: '4px 0', width: 240 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h2 style={{ fontWeight: 700, fontSize: '1.4rem' }}>{name}</h2>
            )}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: 24 }} />

        {/* Contact info */}
        <h3 style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: 600, marginBottom: 16 }}>CONTACT INFORMATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px 0', marginBottom: 32, fontSize: '0.9rem' }}>
          <span style={{ color: '#6b7280', fontWeight: 500 }}>Email id:</span>
          <span style={{ color: '#5f6fff' }}>{user?.email}</span>

          <span style={{ color: '#6b7280', fontWeight: 500 }}>Phone:</span>
          {isEdit ? (
            <input className="form-input" style={{ padding: '6px 10px', maxWidth: 260 }} value={phone} onChange={(e) => setPhone(e.target.value)} />
          ) : (
            <span style={{ color: '#374151' }}>{phone || '—'}</span>
          )}

          <span style={{ color: '#6b7280', fontWeight: 500 }}>Address:</span>
          {isEdit ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input className="form-input" style={{ padding: '6px 10px', maxWidth: 320 }} placeholder="Line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <input className="form-input" style={{ padding: '6px 10px', maxWidth: 320 }} placeholder="Line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
          ) : (
            <span style={{ color: '#374151' }}>
              {address1 || '—'}{address2 ? <><br />{address2}</> : ''}
            </span>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: 24 }} />

        {/* Basic info */}
        <h3 style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: 600, marginBottom: 16 }}>BASIC INFORMATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px 0', fontSize: '0.9rem', marginBottom: 32 }}>
          <span style={{ color: '#6b7280', fontWeight: 500 }}>Gender:</span>
          {isEdit ? (
            <select className="form-input" style={{ padding: '6px 10px', maxWidth: 200 }} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>Not Selected</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          ) : (
            <span style={{ color: '#374151' }}>{gender}</span>
          )}

          <span style={{ color: '#6b7280', fontWeight: 500 }}>Birthday:</span>
          {isEdit ? (
            <input type="date" className="form-input" style={{ padding: '6px 10px', maxWidth: 200 }} value={dob} onChange={(e) => setDob(e.target.value)} />
          ) : (
            <span style={{ color: '#374151' }}>{dob || '—'}</span>
          )}
        </div>

        {/* Actions */}
        {isEdit ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-outline" onClick={() => setIsEdit(false)} style={{ borderRadius: 8, padding: '8px 24px' }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ borderRadius: 8, padding: '8px 24px' }}>
              {saving ? 'Saving...' : 'Save information'}
            </button>
          </div>
        ) : (
          <button className="btn-outline" onClick={() => setIsEdit(true)} style={{ borderRadius: 8, padding: '8px 24px' }}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
