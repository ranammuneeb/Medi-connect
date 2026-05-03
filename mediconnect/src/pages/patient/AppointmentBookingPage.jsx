import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { appointmentsAPI, doctorsAPI } from '../../services/api';

function getNextDays() {
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const days = [];
  let d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < 7) {
    if (d.getDay() !== 0) {
      days.push({
        label: dayNames[d.getDay()],
        date: d.getDate(),
        fullDate: d.toISOString().split('T')[0],
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const TIME_SLOTS = [
  '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am',
  '11:00 am', '11:30 am', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
  '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm',
];

export default function AppointmentBookingPage() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const days = getNextDays();
  const preselectedTime = searchParams.get('time') || '';
  const preselectedDate = searchParams.get('date') || '';
  const preselectedDayIdx = preselectedDate
    ? days.findIndex((d) => d.fullDate === preselectedDate)
    : 0;

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [selectedDay, setSelectedDay] = useState(preselectedDayIdx >= 0 ? preselectedDayIdx : 0);
  const [selectedTime, setSelectedTime] = useState(preselectedTime);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoadingDoctor(true);
    doctorsAPI.getById(doctorId)
      .then(setDoctor)
      .catch(() => setDoctor(null))
      .finally(() => setLoadingDoctor(false));
  }, [doctorId]);

  const handleBook = async () => {
    if (!selectedTime) { setError('Please select a time slot'); return; }
    if (!user) { navigate('/auth/login'); return; }
    setError('');
    setLoading(true);
    try {
      const appointment = await appointmentsAPI.book({
        patientId: user._id,
        patientName: user.name,
        patientEmail: user.email,
        patientPhone: user.phone || 'N/A',
        doctorId: doctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: days[selectedDay].fullDate,
        time: selectedTime,
        symptoms: '',
        fee: doctor.consultationFee,
      });
      navigate(`/patient/payment/${appointment._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div>
        <PatientNavbar />
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280' }}>
          <h2>Loading doctor...</h2>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div>
        <PatientNavbar />
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280' }}>
          <h2>Doctor not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PatientNavbar />
      <div className="booking-page" style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>

        {/* Doctor info row */}
        <div style={{
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
          padding: 24,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          marginBottom: 32,
          background: '#fff',
        }}>
          <img
            src={doctor.avatar || `https://randomuser.me/api/portraits/men/1.jpg`}
            alt={doctor.name}
            style={{ width: 100, height: 100, borderRadius: 10, objectFit: 'cover', background: '#eef0ff', flexShrink: 0 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{doctor.name}</span>
              <img src={assets.verified_icon} alt="verified" style={{ width: 18 }} />
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: 8 }}>
              {doctor.specialty}&nbsp;
              {doctor.experience > 0 && (
                <span style={{ border: '1px solid #e5e7eb', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem', color: '#374151' }}>
                  {doctor.experience} yrs exp.
                </span>
              )}
            </div>
            {doctor.bio && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <img src={assets.info_icon} alt="" style={{ width: 14 }} />
                <span style={{ color: '#374151', fontSize: '0.85rem', fontWeight: 500 }}>About</span>
              </div>
            )}
            <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: 6, maxWidth: 520, lineHeight: 1.6 }}>
              {doctor.bio}
            </p>
            <div style={{ marginTop: 8, fontSize: '0.88rem', color: '#374151' }}>
              Appointment fee: <strong style={{ color: '#5f6fff' }}>${doctor.consultationFee}</strong>
            </div>
          </div>
        </div>

        {/* Slot selector */}
        <div className="slot-section">
          <h3>Booking slots</h3>

          <div className="day-slots">
            {days.map((day, i) => (
              <button
                key={day.fullDate}
                className={`day-btn ${selectedDay === i ? 'selected' : ''}`}
                onClick={() => { setSelectedDay(i); setSelectedTime(''); }}
              >
                <div style={{ fontSize: '0.72rem' }}>{day.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{day.date}</div>
              </button>
            ))}
          </div>

          <div className="time-slots">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                className={`time-btn ${selectedTime === slot ? 'selected' : ''}`}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {selectedTime && (
          <div style={{ background: '#eef0ff', borderRadius: 10, padding: '14px 20px', marginBottom: 20, fontSize: '0.88rem', color: '#374151' }}>
            <strong>Selected:</strong> {days[selectedDay].label} {days[selectedDay].date} &nbsp;|&nbsp; {selectedTime} &nbsp;|&nbsp; Fee: ${doctor.consultationFee}
          </div>
        )}

        <button className="btn-primary" onClick={handleBook} disabled={loading}>
          {loading ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>
    </div>
  );
}
