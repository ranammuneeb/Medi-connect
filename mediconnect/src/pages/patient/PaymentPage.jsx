import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import { appointmentsAPI, paymentsAPI } from '../../services/api';
import { assets } from '../../assets/assets';

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success' | 'failed'
  const [txnId, setTxnId] = useState('');
  const [error, setError] = useState('');

  // card fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    appointmentsAPI.getAll().then((all) => {
      const appt = all.find((a) => String(a.id) === String(appointmentId));
      setAppointment(appt || null);
    });
  }, [appointmentId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    if (!cardName || !cardNumber || !expiry || !cvv) { setError('Please fill all card details'); return; }
    setStep('processing');
    try {
      const result = await paymentsAPI.processPayment({
        appointmentId,
        amount: appointment?.fee || 0,
        cardNumber,
      });
      setTxnId(result.transactionId);
      setStep('success');
    } catch (err) {
      setStep('failed');
    }
  };

  return (
    <div>
      <PatientNavbar />
      <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 20px' }}>

        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Processing Payment...</h3>
            <p style={{ color: '#6b7280' }}>Please do not close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px solid #10b981', borderRadius: 16, background: '#f0fdf4' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
            <h3 style={{ fontWeight: 700, color: '#065f46', marginBottom: 8 }}>Booking Confirmed!</h3>
            {appointment && (
              <div style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', marginBottom: 20, textAlign: 'left', fontSize: '0.88rem', color: '#374151' }}>
                <div style={{ marginBottom: 6 }}><strong>Doctor:</strong> {appointment.doctorName}</div>
                <div style={{ marginBottom: 6 }}><strong>Date & Time:</strong> {appointment.date} at {appointment.time}</div>
                <div><strong>Amount Paid:</strong> ${appointment.fee}</div>
              </div>
            )}
            <p style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: 20 }}>Txn ID: {txnId}</p>
            <button className="btn-primary" onClick={() => navigate('/patient/appointments')}>
              My Appointments →
            </button>
          </div>
        )}

        {step === 'failed' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px solid #ef4444', borderRadius: 16, background: '#fef2f2' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>❌</div>
            <h3 style={{ fontWeight: 700, color: '#991b1b', marginBottom: 8 }}>Payment Failed</h3>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>Your card was declined. Please try again.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-primary" style={{ background: '#ef4444' }} onClick={() => setStep('form')}>Try Again</button>
              <button className="btn-outline" onClick={() => navigate('/patient/appointments')}>Back to Appointments</button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: 24 }}>Complete Payment</h2>

            {/* Order summary */}
            {appointment && (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px', marginBottom: 24, background: '#fff', fontSize: '0.9rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12 }}>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#6b7280' }}>Doctor</span>
                  <strong>{appointment.doctorName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#6b7280' }}>Date & Time</span>
                  <strong>{appointment.date} • {appointment.time}</strong>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Total</strong>
                  <strong style={{ color: '#5f6fff', fontSize: '1.1rem' }}>${appointment.fee}</strong>
                </div>
              </div>
            )}

            {/* Payment methods */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <img src={assets.stripe_logo} alt="Stripe" style={{ height: 28, border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }} />
              <img src={assets.razorpay_logo} alt="Razorpay" style={{ height: 28, border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }} />
            </div>

            {/* Card form */}
            <form onSubmit={handlePay}>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input className="form-input" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input className="form-input" placeholder="MM / YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-input" type="password" placeholder="•••" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value)} />
                </div>
              </div>

              {error && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
                Pay ${appointment?.fee || '...'}
              </button>
              <button type="button" className="btn-outline" style={{ width: '100%', marginTop: 10, borderRadius: 8 }} onClick={() => navigate(-1)}>
                Cancel
              </button>
            </form>

            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>
              Demo: any card = success. Card ending in 0000 = failure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
