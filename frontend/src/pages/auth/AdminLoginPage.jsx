import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields'); return; }
    setLoading(true);
    try {
      const user = await authAPI.login({ email, password, role: 'admin' });
      login(user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <img src={assets.logo} alt="MediConnect" style={{ height: 40 }} />
        </div>
        <h2>Admin Login</h2>
        <p>Access the MediConnect admin panel</p>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <input className="form-control" type="email" placeholder="admin@mediconnect.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn w-100 rounded-pill mt-1" style={{ background: '#5f6fff', color: '#fff', border: 'none' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <div className="demo-box mt-3">
          <strong>Demo Credentials:</strong>
          admin@mediconnect.com / admin123
        </div>

        <div className="text-center mt-3">
          <Link to="/auth/login" style={{ fontSize: '0.85rem', color: '#6b7280' }}>← Back to Patient Login</Link>
        </div>
      </div>
    </div>
  );
}
