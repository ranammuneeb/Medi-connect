import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { assets } from '../../assets/assets';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (tokenParam) setToken(tokenParam);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) { setError('Reset token is missing'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, password });
      setSuccess('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password');
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
        <h2 className="fw-bold">Reset Password</h2>
        <p>Enter your new password below.</p>

        {error && <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>{error}</div>}
        {success && <div className="alert alert-success py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Reset Token</label>
            <input className="form-control" type="text" placeholder="Enter token from email" value={token} onChange={(e) => setToken(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input className="form-control" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input className="form-control" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn w-100 rounded-pill" style={{ background: '#5f6fff', color: '#fff', border: 'none', padding: '10px' }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" style={{ fontSize: '0.88rem', color: '#5f6fff', fontWeight: 600, textDecoration: 'none' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
