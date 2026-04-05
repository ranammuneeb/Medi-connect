import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { doctorsAPI, specialties, locations } from '../../services/api';

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontSize: '0.88rem',
  outline: 'none',
};

export default function ManageDoctorsPage() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [saving, setSaving] = useState(false);

  // form fields
  const [form, setForm] = useState({ name: '', email: '', specialty: '', location: '', experience: '', consultationFee: '', phone: '', education: '', bio: '' });

  const fetchDoctors = async () => {
    setLoading(true);
    const data = await doctorsAPI.getAll({ search });
    setDoctorsList(data);
    setLoading(false);
  };

  useEffect(() => { fetchDoctors(); }, [search]);

  const openAdd = () => {
    setEditingDoctor(null);
    setForm({ name: '', email: '', specialty: '', location: '', experience: '', consultationFee: '', phone: '', education: '', bio: '' });
    setShowModal(true);
  };

  const openEdit = (doc) => {
    setEditingDoctor(doc);
    setForm({ name: doc.name, email: doc.email, specialty: doc.specialty, location: doc.location, experience: doc.experience, consultationFee: doc.consultationFee, phone: doc.phone, education: doc.education, bio: doc.bio || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.specialty) { alert('Name, email and specialty are required'); return; }
    setSaving(true);
    try {
      if (editingDoctor) {
        await doctorsAPI.update(editingDoctor.id, form);
      } else {
        await doctorsAPI.create({ ...form, rating: 4.5, avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70) + 1}.jpg`, availability: {}, licenseNumber: `LIC-${Date.now()}`, joinedDate: new Date().toISOString().split('T')[0] });
      }
      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      alert(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    await doctorsAPI.delete(id);
    fetchDoctors();
  };

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>Doctors List</h1>
            <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>{doctorsList.length} doctors registered</p>
          </div>
          <button className="btn-primary" style={{ borderRadius: 8, padding: '9px 20px' }} onClick={openAdd}>+ Add Doctor</button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            style={{ ...inputStyle, maxWidth: 340 }}
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Doctor', 'Specialty', 'Location', 'Experience', 'Fee', 'Rating', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} style={{ padding: '12px 16px' }}><div className="skeleton" style={{ height: 20, borderRadius: 4 }} /></td></tr>
                ))
              ) : doctorsList.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={doc.avatar} alt={doc.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{doc.name}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{doc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#eef0ff', color: '#5f6fff', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 500 }}>{doc.specialty}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{doc.location}</td>
                  <td style={{ padding: '12px 16px' }}>{doc.experience} yrs</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#5f6fff' }}>${doc.consultationFee}</td>
                  <td style={{ padding: '12px 16px' }}>⭐ {doc.rating}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(doc)} style={{ padding: '5px 12px', border: '1px solid #5f6fff', borderRadius: 6, background: '#fff', color: '#5f6fff', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                      <button onClick={() => handleDelete(doc.id)} style={{ padding: '5px 12px', border: '1px solid #ef4444', borderRadius: 6, background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['name', 'Full Name *', 'text'], ['email', 'Email *', 'email'], ['phone', 'Phone', 'text'], ['education', 'Education', 'text']].map(([key, label, type]) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>{label}</label>
                    <input style={inputStyle} type={type} value={form[key]} onChange={(e) => setField(key, e.target.value)} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Specialty *</label>
                  <select style={inputStyle} value={form.specialty} onChange={(e) => setField('specialty', e.target.value)}>
                    <option value="">Select</option>
                    {specialties.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Location</label>
                  <select style={inputStyle} value={form.location} onChange={(e) => setField('location', e.target.value)}>
                    <option value="">Select</option>
                    {locations.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Experience (yrs)</label>
                  <input style={inputStyle} type="number" min={0} value={form.experience} onChange={(e) => setField('experience', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Fee ($)</label>
                  <input style={inputStyle} type="number" min={0} value={form.consultationFee} onChange={(e) => setField('consultationFee', e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 5 }}>Bio</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.bio} onChange={(e) => setField('bio', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn-outline" style={{ borderRadius: 8, padding: '9px 20px' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ borderRadius: 8, padding: '9px 20px' }} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
