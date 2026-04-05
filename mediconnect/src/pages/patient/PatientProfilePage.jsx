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

      <div className="px-4 py-4" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Avatar + name */}
        <div className="d-flex align-items-end gap-3 mb-4">
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
                className="form-control"
                style={{ fontSize: '1.2rem', fontWeight: 700, border: 'none', borderBottom: '2px solid #5f6fff', borderRadius: 0, padding: '4px 0', width: 240, boxShadow: 'none' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h2 className="fw-bold" style={{ fontSize: '1.4rem' }}>{name}</h2>
            )}
          </div>
        </div>

        <hr className="mb-4" />

        {/* Contact info */}
        <h3 className="text-muted fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>CONTACT INFORMATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px 0', marginBottom: 32, fontSize: '0.9rem' }}>
          <span className="text-muted fw-medium">Email id:</span>
          <span style={{ color: '#5f6fff' }}>{user?.email}</span>

          <span className="text-muted fw-medium">Phone:</span>
          {isEdit ? (
            <input className="form-control" style={{ padding: '6px 10px', maxWidth: 260 }} value={phone} onChange={(e) => setPhone(e.target.value)} />
          ) : (
            <span style={{ color: '#374151' }}>{phone || '—'}</span>
          )}

          <span className="text-muted fw-medium">Address:</span>
          {isEdit ? (
            <div className="d-flex flex-column gap-2">
              <input className="form-control" style={{ padding: '6px 10px', maxWidth: 320 }} placeholder="Line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <input className="form-control" style={{ padding: '6px 10px', maxWidth: 320 }} placeholder="Line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
          ) : (
            <span style={{ color: '#374151' }}>
              {address1 || '—'}{address2 ? <><br />{address2}</> : ''}
            </span>
          )}
        </div>

        <hr className="mb-4" />

        {/* Basic info */}
        <h3 className="text-muted fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>BASIC INFORMATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px 0', fontSize: '0.9rem', marginBottom: 32 }}>
          <span className="text-muted fw-medium">Gender:</span>
          {isEdit ? (
            <select className="form-select" style={{ padding: '6px 10px', maxWidth: 200 }} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>Not Selected</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          ) : (
            <span style={{ color: '#374151' }}>{gender}</span>
          )}

          <span className="text-muted fw-medium">Birthday:</span>
          {isEdit ? (
            <input type="date" className="form-control" style={{ padding: '6px 10px', maxWidth: 200 }} value={dob} onChange={(e) => setDob(e.target.value)} />
          ) : (
            <span style={{ color: '#374151' }}>{dob || '—'}</span>
          )}
        </div>

        {/* Actions */}
        {isEdit ? (
          <div className="d-flex gap-3">
            <button className="btn btn-outline-primary rounded" style={{ borderColor: '#5f6fff', color: '#5f6fff', padding: '8px 24px' }} onClick={() => setIsEdit(false)}>
              Cancel
            </button>
            <button className="btn rounded" style={{ background: '#5f6fff', color: '#fff', border: 'none', padding: '8px 24px' }} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save information'}
            </button>
          </div>
        ) : (
          <button className="btn btn-outline-primary rounded" style={{ borderColor: '#5f6fff', color: '#5f6fff', padding: '8px 24px' }} onClick={() => setIsEdit(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
