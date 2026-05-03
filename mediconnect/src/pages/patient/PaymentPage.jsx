import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PatientNavbar from '../../components/common/PatientNavbar';
import { appointmentsAPI, paymentsAPI } from '../../services/api';
import { assets } from '../../assets/assets';

// Stripe Publishable Key is loaded from .env (VITE_STRIPE_PUBLISHABLE_KEY)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ appointment, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    paymentsAPI.processPayment({
      appointmentId: appointment._id,
      amount: appointment.fee,
    }).then(res => {
      setClientSecret(res.clientSecret);
    }).catch(err => {
      setError('Failed to initialize payment.');
    });
  }, [appointment]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError(null);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: appointment.patientName,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      // Payment succeeded!
      try {
        await paymentsAPI.confirmPayment({ appointmentId: appointment._id, transactionId: payload.paymentIntent.id });
        setProcessing(false);
        onSuccess(payload.paymentIntent.id);
      } catch (err) {
        setError('Payment confirmed but failed to update appointment. Please contact support.');
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Test card hint box */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.8rem', color: '#92400e' }}>
        <strong>🧪 Test Mode — Use these card details:</strong><br />
        <span style={{ fontFamily: 'monospace' }}>Card: 4242 4242 4242 4242</span><br />
        <span style={{ fontFamily: 'monospace' }}>Expiry: any future date &nbsp; CVC: any 3 digits &nbsp; ZIP: any 5 digits (e.g. 12345)</span>
      </div>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '20px' }}>
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } } }} />
      </div>
      {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}
      <button disabled={processing || !stripe || !clientSecret} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
        {processing ? 'Processing...' : `Pay $${appointment.fee}`}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    appointmentsAPI.getAll().then((all) => {
      const appt = all.find((a) => String(a._id) === String(appointmentId) || String(a.id) === String(appointmentId));
      setAppointment(appt || null);
    });
  }, [appointmentId]);

  const handleSuccess = (transactionId) => {
    setTxnId(transactionId);
    setStep('success');
  };

  return (
    <div>
      <PatientNavbar />
      <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 20px' }}>

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

        {step === 'form' && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: 24 }}>Complete Payment</h2>

            {appointment ? (
              <>
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

                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <img src={assets.stripe_logo} alt="Stripe" style={{ height: 28, border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }} />
                </div>

                <Elements stripe={stripePromise}>
                  <CheckoutForm appointment={appointment} onSuccess={handleSuccess} />
                </Elements>

                <button type="button" className="btn-outline" style={{ width: '100%', marginTop: 10, borderRadius: 8 }} onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </>
            ) : (
              <p>Loading appointment details...</p>
            )}
            
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>
              🔒 Secure payment processed by Stripe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
