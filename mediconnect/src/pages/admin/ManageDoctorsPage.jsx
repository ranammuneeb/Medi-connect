import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { doctorsAPI, specialties, locations } from '../../services/api';

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
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Doctors List</h1>
            <p className="text-muted" style={{ fontSize: '0.88rem' }}>{doctorsList.length} doctors registered</p>
          </div>
          <button className="btn rounded" style={{ background: '#5f6fff', color: '#fff', border: 'none', padding: '9px 20px' }} onClick={openAdd}>+ Add Doctor</button>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            className="form-control"
            style={{ maxWidth: 340 }}
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0" style={{ fontSize: '0.88rem' }}>
                <thead className="table-light">
                  <tr>
                    {['Doctor', 'Specialty', 'Location', 'Experience', 'Fee', 'Rating', 'Actions'].map((h) => (
                      <th key={h} style={{ fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={7}><div className="skeleton" style={{ height: 20, borderRadius: 4 }} /></td></tr>
                    ))
                  ) : doctorsList.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={doc.avatar} alt={doc.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div className="fw-semibold">{doc.name}</div>
                            <div className="text-muted" style={{ fontSize: '0.78rem' }}>{doc.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge rounded-pill" style={{ background: '#eef0ff', color: '#5f6fff', fontSize: '0.78rem', fontWeight: 500 }}>{doc.specialty}</span>
                      </td>
                      <td className="text-muted">{doc.location}</td>
                      <td>{doc.experience} yrs</td>
                      <td className="fw-semibold" style={{ color: '#5f6fff' }}>${doc.consultationFee}</td>
                      <td>⭐ {doc.rating}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button onClick={() => openEdit(doc)} className="btn btn-sm btn-outline-primary" style={{ borderColor: '#5f6fff', color: '#5f6fff', fontSize: '0.8rem' }}>Edit</button>
                          <button onClick={() => handleDelete(doc.id)} className="btn btn-sm btn-outline-danger" style={{ fontSize: '0.8rem' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card shadow" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', borderRadius: 16 }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                <button onClick={() => setShowModal(false)} className="btn-close" />
              </div>
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  {[['name', 'Full Name *', 'text'], ['email', 'Email *', 'email'], ['phone', 'Phone', 'text'], ['education', 'Education', 'text']].map(([key, label, type]) => (
                    <div key={key} className="col-6">
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>{label}</label>
                      <input className="form-control" type={type} value={form[key]} onChange={(e) => setField(key, e.target.value)} />
                    </div>
                  ))}
                  <div className="col-6">
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Specialty *</label>
                    <select className="form-select" value={form.specialty} onChange={(e) => setField('specialty', e.target.value)}>
                      <option value="">Select</option>
                      {specialties.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Location</label>
                    <select className="form-select" value={form.location} onChange={(e) => setField('location', e.target.value)}>
                      <option value="">Select</option>
                      {locations.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Experience (yrs)</label>
                    <input className="form-control" type="number" min={0} value={form.experience} onChange={(e) => setField('experience', e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Fee ($)</label>
                    <input className="form-control" type="number" min={0} value={form.consultationFee} onChange={(e) => setField('consultationFee', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}>Bio</label>
                    <textarea className="form-control" style={{ resize: 'vertical' }} rows={2} value={form.bio} onChange={(e) => setField('bio', e.target.value)} />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="button" className="btn btn-outline-primary rounded" style={{ borderColor: '#5f6fff', color: '#5f6fff', padding: '9px 20px' }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn rounded" style={{ background: '#5f6fff', color: '#fff', border: 'none', padding: '9px 20px' }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
