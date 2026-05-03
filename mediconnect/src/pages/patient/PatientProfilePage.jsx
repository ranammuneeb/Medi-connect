import { useState, useRef } from 'react';
import PatientNavbar from '../../components/common/PatientNavbar';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PatientProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address1, setAddress1] = useState(user?.address1 || '');
  const [address2, setAddress2] = useState(user?.address2 || '');
  const [gender, setGender] = useState(user?.gender || 'Not Selected');
  const [dob, setDob] = useState(user?.dob || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  const initialsAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=5f6fff&color=fff&size=128`;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_URL.replace('/api', '')}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setAvatarUrl(data.url);
        updateUser({ avatar: data.url });
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    updateUser({ name, phone, address1, address2, gender, dob, avatar: avatarUrl });
    setIsEdit(false);
    setSaving(false);
  };

  return (
    <div>
      <PatientNavbar />

      <div className="px-4 py-4" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="d-flex align-items-end gap-3 mb-4">
          <div style={{ position: 'relative' }}>
            <img
              src={avatarUrl || initialsAvatar}
              alt={user?.name}
              style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', background: '#eef0ff' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingAvatar}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                background: uploadingAvatar ? '#9ca3af' : '#5f6fff',
                color: '#fff', border: 'none', borderRadius: '50%',
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
              title="Upload profile picture"
            >
              {uploadingAvatar ? '⏳' : '📷'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            {isEdit ? (
              <input className="form-control fw-bold h4 mb-0" style={{ maxWidth: 300 }} value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <h2 className="fw-bold mb-0" style={{ fontSize: '1.4rem' }}>{name}</h2>
            )}
            <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.88rem' }}>Patient ID: {user?._id?.slice(-6)}</p>
          </div>
        </div>

        <h3 className="text-muted fw-semibold mb-3" style={{ fontSize: '0.95rem' }}>CONTACT INFORMATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px 0', marginBottom: 32, fontSize: '0.9rem' }}>
          <span className="text-muted fw-medium">Email:</span>
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

        {isEdit ? (
          <div className="d-flex gap-3">
            <button className="btn-outline" style={{ padding: '8px 24px' }} onClick={() => setIsEdit(false)}>
              Cancel
            </button>
            <button className="btn-primary" style={{ padding: '8px 24px' }} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save information'}
            </button>
          </div>
        ) : (
          <button className="btn-outline" style={{ padding: '8px 24px' }} onClick={() => setIsEdit(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
