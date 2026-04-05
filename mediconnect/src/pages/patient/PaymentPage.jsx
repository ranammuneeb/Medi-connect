import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import PatientNavbar from '../../components/common/PatientNavbar';
import { appointmentsAPI, paymentsAPI } from '../../services/api';
import { queryClient } from '../../lib/queryClient';

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [paymentStep, setPaymentStep] = useState('form'); // 'form' | 'processing' | 'success' | 'failed'
  const [txnId, setTxnId] = useState('');

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', 'all'],
    queryFn: () => appointmentsAPI.getAll(),
  });

  const appointment = appointments.find((a) => a.id === appointmentId);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutate: processPayment, isPending } = useMutation({
    mutationFn: (data) =>
      paymentsAPI.processPayment({
        appointmentId,
        amount: appointment?.fee || 0,
        cardNumber: data.cardNumber,
      }),
    onMutate: () => setPaymentStep('processing'),
    onSuccess: (result) => {
      setTxnId(result.transactionId);
      setPaymentStep('success');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Payment successful! 🎉');
    },
    onError: (err) => {
      setPaymentStep('failed');
      toast.error(err.message || 'Payment failed');
    },
  });

  if (!appointment && appointments.length > 0) {
    return (
      <div>
        <PatientNavbar />
        <div className="container py-5 text-center">
          <h3>Appointment not found</h3>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/patient/appointments')}>
            Go to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PatientNavbar />

      <div style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', padding: '30px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem' }}>💳 Secure Payment</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>Complete your appointment booking</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">

            {/* Success State */}
            <AnimatePresence mode="wait">
              {paymentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="card text-center p-5"
                  style={{ border: '2px solid #198754' }}
                >
                  <div style={{ fontSize: '5rem', marginBottom: 16 }}>✅</div>
                  <h3 className="fw-bold text-success mb-2">Payment Successful!</h3>
                  <p className="text-muted mb-1">Your appointment has been confirmed.</p>
                  <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                    Transaction ID: <strong>{txnId}</strong>
                  </p>
                  {appointment && (
                    <div className="alert alert-success text-start" style={{ fontSize: '0.88rem' }}>
                      <div><strong>Doctor:</strong> {appointment.doctorName}</div>
                      <div><strong>Date:</strong> {appointment.date} at {appointment.time}</div>
                      <div><strong>Amount:</strong> ${appointment.fee}</div>
                    </div>
                  )}
                  <button className="btn btn-success w-100 mt-2" onClick={() => navigate('/patient/appointments')}>
                    View My Appointments →
                  </button>
                </motion.div>
              )}

              {/* Failed State */}
              {paymentStep === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card text-center p-5"
                  style={{ border: '2px solid #dc3545' }}
                >
                  <div style={{ fontSize: '5rem', marginBottom: 16 }}>❌</div>
                  <h3 className="fw-bold text-danger mb-2">Payment Failed</h3>
                  <p className="text-muted mb-3">Your card was declined. Please check your details.</p>
                  <button className="btn btn-danger w-100" onClick={() => setPaymentStep('form')}>
                    Try Again
                  </button>
                  <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate('/patient/appointments')}>
                    Back to Appointments
                  </button>
                </motion.div>
              )}

              {/* Processing State */}
              {paymentStep === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card text-center p-5"
                >
                  <div className="spinner-border text-primary mb-4" style={{ width: 60, height: 60, margin: '0 auto' }} />
                  <h4 className="fw-semibold">Processing Payment...</h4>
                  <p className="text-muted">Please do not close this window</p>
                </motion.div>
              )}

              {/* Payment Form */}
              {paymentStep === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Order Summary */}
                  {appointment && (
                    <div className="card p-4 mb-4" style={{ border: '2px solid #e0f2fe' }}>
                      <h5 className="fw-bold mb-3">📋 Order Summary</h5>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Doctor</span>
                        <strong>{appointment.doctorName}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Specialty</span>
                        <strong>{appointment.specialty}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Date & Time</span>
                        <strong>{appointment.date} • {appointment.time}</strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Total</span>
                        <span className="fw-bold text-primary" style={{ fontSize: '1.2rem' }}>${appointment.fee}</span>
                      </div>
                    </div>
                  )}

                  {/* Card Details Form */}
                  <div className="card p-4">
                    <h5 className="fw-bold mb-4">💳 Card Details</h5>
                    <form onSubmit={handleSubmit(processPayment)}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Cardholder Name</label>
                        <input className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                          placeholder="John Doe"
                          {...register('cardName', { required: 'Name is required' })} />
                        {errors.cardName && <div className="invalid-feedback">{errors.cardName.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Card Number</label>
                        <input
                          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          {...register('cardNumber', {
                            required: 'Card number is required',
                            pattern: { value: /^[\d\s]{16,19}$/, message: 'Enter a valid card number' },
                          })}
                        />
                        {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber.message}</div>}
                      </div>
                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <label className="form-label fw-semibold">Expiry Date</label>
                          <input className="form-control" placeholder="MM / YY"
                            {...register('expiry', { required: 'Required' })} />
                        </div>
                        <div className="col-6">
                          <label className="form-label fw-semibold">CVV</label>
                          <input className="form-control" placeholder="•••" maxLength={4}
                            type="password"
                            {...register('cvv', { required: 'Required', minLength: { value: 3, message: 'Min 3 digits' } })} />
                        </div>
                      </div>
                      <div className="alert alert-info p-2 mb-3" style={{ fontSize: '0.8rem' }}>
                        <strong>Test:</strong> Any valid card = success. Card ending in <strong>0000</strong> = failure.
                      </div>
                      <button type="submit" className="btn btn-primary w-100 py-2" style={{ fontSize: '1.05rem' }}>
                        🔐 Pay ${appointment?.fee || '...'}
                      </button>
                    </form>
                    <div className="text-center mt-2">
                      <button className="btn btn-link text-muted" onClick={() => navigate(-1)}>
                        ← Cancel and go back
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
