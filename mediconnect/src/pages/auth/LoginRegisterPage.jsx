import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

export default function LoginRegisterPage() {
  const [activeTab, setActiveTab] = useState('Login');
  const [role, setRole] = useState('patient'); // 'patient' | 'doctor'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) { setError('Please fill all fields'); return; }
    setLoading(true);
    try {
      const user = await authAPI.login({ email: loginEmail, password: loginPassword, role });
      login(user);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/home');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!regName || !regEmail || !regPassword) { setError('Please fill all fields'); return; }
    if (regPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await authAPI.register({ name: regName, email: regEmail, password: regPassword, role });
      login(user);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/home');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => { setActiveTab(tab); setError(''); };
  const switchRole = (r) => { setRole(r); setError(''); };

  const demoCredentials = role === 'patient'
    ? 'alice@example.com / password123'
    : 'sarah.johnson@mediconnect.com / password123';

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="text-center mb-4">
          <img src={assets.logo} alt="MediConnect" style={{ height: 40 }} />
        </div>

        <h2>{activeTab === 'Login' ? 'Login' : 'Create Account'}</h2>
        <p>Please {activeTab === 'Login' ? 'log in' : 'sign up'} to book appointment</p>

        {/* Login / Sign Up tabs */}
        <div className="auth-tabs" style={{ marginBottom: 16 }}>
          <button className={`auth-tab ${activeTab === 'Login' ? 'active' : ''}`} onClick={() => switchTab('Login')}>Login</button>
          <button className={`auth-tab ${activeTab === 'Register' ? 'active' : ''}`} onClick={() => switchTab('Register')}>Sign Up</button>
        </div>

        {/* Patient / Doctor role toggle */}
        <div className="d-flex gap-2 mb-3">
          <button
            onClick={() => switchRole('patient')}
            style={{
              flex: 1,
              padding: '9px',
              border: `1.5px solid ${role === 'patient' ? '#5f6fff' : '#e5e7eb'}`,
              borderRadius: 8,
              background: role === 'patient' ? '#eef0ff' : '#fff',
              color: role === 'patient' ? '#5f6fff' : '#6b7280',
              fontWeight: role === 'patient' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'all 0.2s',
            }}
          >
            🧑 Patient
          </button>
          <button
            onClick={() => switchRole('doctor')}
            style={{
              flex: 1,
              padding: '9px',
              border: `1.5px solid ${role === 'doctor' ? '#5f6fff' : '#e5e7eb'}`,
              borderRadius: 8,
              background: role === 'doctor' ? '#eef0ff' : '#fff',
              color: role === 'doctor' ? '#5f6fff' : '#6b7280',
              fontWeight: role === 'doctor' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'all 0.2s',
            }}
          >
            👨‍⚕️ Doctor
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {activeTab === 'Login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" placeholder="m@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn w-100 rounded-pill mt-1" style={{ background: '#5f6fff', color: '#fff', border: 'none' }} disabled={loading}>
              {loading ? 'Logging in...' : `Login as ${role === 'patient' ? 'Patient' : 'Doctor'}`}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input className="form-control" type="text" placeholder="Enter your name" value={regName} onChange={(e) => setRegName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" placeholder="m@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Min 6 characters" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn w-100 rounded-pill mt-1" style={{ background: '#5f6fff', color: '#fff', border: 'none' }} disabled={loading}>
              {loading ? 'Creating account...' : `Sign up as ${role === 'patient' ? 'Patient' : 'Doctor'}`}
            </button>
          </form>
        )}

        <div className="text-center mt-3" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          {activeTab === 'Login' ? (
            <>Don't have an account?{' '}
              <span style={{ color: '#5f6fff', cursor: 'pointer', fontWeight: 600 }} onClick={() => switchTab('Register')}>Sign up</span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span style={{ color: '#5f6fff', cursor: 'pointer', fontWeight: 600 }} onClick={() => switchTab('Login')}>Login</span>
            </>
          )}
        </div>

        <div className="text-center mt-2">
          <Link to="/admin/login" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Admin login →</Link>
        </div>

        <div className="demo-box">
          <strong>Demo ({role}):</strong> {demoCredentials}
        </div>
      </div>
    </div>
  );
}
