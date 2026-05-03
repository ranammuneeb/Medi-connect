import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { assets } from '../../assets/assets';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      setSuccess('Reset token generated successfully! (Dev Note: Token shown below for testing)');
      // For dev testing, we show the token. In real app, this would be in user's email.
      console.log('Reset Token:', res.resetToken);
      // Auto-navigate to reset page after 2 seconds
      setTimeout(() => {
        navigate(`/reset-password?token=${res.resetToken}`);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
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
        <h2 className="fw-bold">Forgot Password</h2>
        <p>Enter your email to receive a password reset token.</p>

        {error && <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>{error}</div>}
        {success && (
          <div className="alert alert-success py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
            {success}
            <div className="mt-2 text-center">
              <strong>Redirecting to Reset Page...</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn w-100 rounded-pill" style={{ background: '#5f6fff', color: '#fff', border: 'none', padding: '10px' }} disabled={loading}>
            {loading ? 'Processing...' : 'Send Reset Token'}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" style={{ fontSize: '0.88rem', color: '#5f6fff', fontWeight: 600, textDecoration: 'none' }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
