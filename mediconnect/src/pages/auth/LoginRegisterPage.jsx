import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI, specialties } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const tabs = ['Login', 'Register'];
const roles = ['patient', 'doctor'];

export default function LoginRegisterPage() {
  const [activeTab, setActiveTab] = useState('Login');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (activeTab === 'Login') {
        const user = await authAPI.login({ ...data, role });
        login(user);
        toast.success(`Welcome back, ${user.name}! 👋`);
        if (role === 'doctor') navigate('/doctor/dashboard');
        else navigate('/patient/home');
      } else {
        const user = await authAPI.register({ ...data, role });
        login(user);
        toast.success(`Account created! Welcome, ${user.name}! 🎉`);
        if (role === 'doctor') navigate('/doctor/dashboard');
        else navigate('/patient/home');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    reset();
  };

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="auth-card"
            >
              {/* Header */}
              <div className="text-center mb-4">
                <div style={{ fontSize: '2.5rem' }}>🏥</div>
                <h2 className="fw-800">MediConnect</h2>
                <p className="text-muted">Your trusted healthcare companion</p>
              </div>

              {/* Tab Switch */}
              <div className="d-flex bg-light rounded-3 p-1 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`btn flex-1 fw-semibold transition-all ${activeTab === tab ? 'btn-primary' : 'btn-transparent'}`}
                    style={{ flex: 1, borderRadius: 8 }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Role Switch */}
              <div className="d-flex gap-2 mb-4">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); reset(); }}
                    className={`btn flex-1 ${role === r ? 'btn-primary' : 'btn-outline-primary'}`}
                    style={{ flex: 1, borderRadius: 8, textTransform: 'capitalize' }}
                  >
                    {r === 'patient' ? '🏃 Patient' : '👨‍⚕️ Doctor'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={`${activeTab}-${role}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Common Login Fields */}
                  {activeTab === 'Login' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="Enter your email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                          })}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                          type="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Enter your password"
                          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                      </div>
                    </>
                  )}

                  {/* Patient Register Fields */}
                  {activeTab === 'Register' && role === 'patient' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Full Name</label>
                        <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="John Doe"
                          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })} />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="john@example.com"
                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Phone Number</label>
                        <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`} placeholder="+1 (555) 000-0000"
                          {...register('phone', { required: 'Phone is required', pattern: { value: /^[\+]?[\d\s\-\(\)]{10,}$/, message: 'Invalid phone number' } })} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label className="form-label fw-semibold">Date of Birth</label>
                          <input type="date" className="form-control" {...register('dob', { required: 'DOB is required' })} />
                        </div>
                        <div className="col">
                          <label className="form-label fw-semibold">Gender</label>
                          <select className="form-select" {...register('gender', { required: 'Required' })}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Min 6 characters"
                          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                      </div>
                    </>
                  )}

                  {/* Doctor Register Fields */}
                  {activeTab === 'Register' && role === 'doctor' && (
                    <>
                      <div className="row mb-3">
                        <div className="col">
                          <label className="form-label fw-semibold">Full Name</label>
                          <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Dr. Jane Smith"
                            {...register('name', { required: 'Name is required' })} />
                          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>
                        <div className="col">
                          <label className="form-label fw-semibold">Gender</label>
                          <select className="form-select" {...register('gender')}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="dr.jane@example.com"
                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label className="form-label fw-semibold">Specialization</label>
                          <select className={`form-select ${errors.specialization ? 'is-invalid' : ''}`} {...register('specialization', { required: 'Required' })}>
                            <option value="">Select</option>
                            {specialties.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          {errors.specialization && <div className="invalid-feedback">{errors.specialization.message}</div>}
                        </div>
                        <div className="col">
                          <label className="form-label fw-semibold">Experience (yrs)</label>
                          <input type="number" className="form-control" placeholder="5"
                            {...register('experience', { required: 'Required', min: { value: 0, message: 'Must be ≥ 0' } })} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label className="form-label fw-semibold">License Number</label>
                          <input className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`} placeholder="NY-CARD-1234"
                            {...register('licenseNumber', { required: 'Required' })} />
                          {errors.licenseNumber && <div className="invalid-feedback">{errors.licenseNumber.message}</div>}
                        </div>
                        <div className="col">
                          <label className="form-label fw-semibold">Consultation Fee ($)</label>
                          <input type="number" className="form-control" placeholder="100"
                            {...register('consultationFee', { required: 'Required' })} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Phone</label>
                        <input className="form-control" placeholder="+1 (555) 000-0000"
                          {...register('phone', { required: 'Required' })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Education / Institution</label>
                        <input className="form-control" placeholder="Harvard Medical School"
                          {...register('education')} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Min 6 characters"
                          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn btn-primary w-100 py-2 mt-2" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                    ) : activeTab === 'Login' ? '🔐 Sign In' : '✨ Create Account'}
                  </button>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      {activeTab === 'Login' ? "Don't have an account? " : 'Already have an account? '}
                      <span
                        className="text-primary fw-semibold cursor-pointer"
                        onClick={() => handleTabChange(activeTab === 'Login' ? 'Register' : 'Login')}
                      >
                        {activeTab === 'Login' ? 'Register' : 'Sign In'}
                      </span>
                    </small>
                  </div>

                  <div className="text-center mt-2">
                    <Link to="/admin/login" className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Admin? Login here →
                    </Link>
                  </div>

                  {/* Demo credentials */}
                  <div className="alert alert-info mt-3 p-2" style={{ fontSize: '0.8rem' }}>
                    <strong>Demo Credentials:</strong><br />
                    {role === 'patient' ? (
                      <>Patient: alice@example.com / password123</>
                    ) : (
                      <>Doctor: sarah.johnson@mediconnect.com / password123</>
                    )}
                  </div>
                </motion.form>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
