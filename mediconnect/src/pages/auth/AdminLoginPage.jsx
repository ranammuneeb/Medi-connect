import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await authAPI.login({ ...data, role: 'admin' });
      login(user);
      toast.success('Welcome, Admin! 🛡️');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f 0%, #0d6efd 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="auth-card"
        style={{ maxWidth: 420 }}
      >
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🛡️</div>
          <h2 className="fw-bold">Admin Portal</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>MediConnect Administration Panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Admin Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="admin@mediconnect.com"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter admin password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Authenticating...</>
            ) : '🔐 Admin Login'}
          </button>
        </form>

        <div className="alert alert-warning mt-3 p-2" style={{ fontSize: '0.8rem' }}>
          <strong>Demo:</strong> admin@mediconnect.com / admin123
        </div>

        <div className="text-center mt-3">
          <a href="/auth/login" className="text-muted" style={{ fontSize: '0.85rem' }}>
            ← Back to Patient/Doctor Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}
