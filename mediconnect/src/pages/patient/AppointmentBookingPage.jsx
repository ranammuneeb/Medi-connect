import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { appointmentsAPI, doctorsAPI } from '../../services/api';

// Map a JS Date's getDay() number to full weekday name matching the doctor's availability keys
const DAY_NUMBER_TO_NAME = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
};

function getNextDays() {
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const days = [];
  let d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < 7) {
    if (d.getDay() !== 0) { // skip Sunday
      days.push({
        label: dayNames[d.getDay()],
        date: d.getDate(),
        fullDate: d.toISOString().split('T')[0],
        dayNumber: d.getDay(), // keep the numeric day for availability lookup
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

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

  // When the day selection changes, clear time selection
  const handleDaySelect = (i) => {
    setSelectedDay(i);
    setSelectedTime('');
  };

  // Get the available slots for the currently selected day
  const getAvailableSlotsForDay = () => {
    if (!doctor || !doctor.availability) return [];
    const dayName = DAY_NUMBER_TO_NAME[days[selectedDay].dayNumber];
    return doctor.availability[dayName] || [];
  };

  // Check if a day has any available slots (used to visually mark days)
  const dayHasSlots = (dayObj) => {
    if (!doctor || !doctor.availability) return false;
    const dayName = DAY_NUMBER_TO_NAME[dayObj.dayNumber];
    return (doctor.availability[dayName] || []).length > 0;
  };

  const availableSlots = getAvailableSlotsForDay();

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
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280' }}>Loading doctor...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div>
        <PatientNavbar />
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280' }}>Doctor not found</div>
      </div>
    );
  }

  return (
    <div>
      <PatientNavbar />
      <div className="booking-page" style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>

        {/* Doctor info row */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, marginBottom: 32, background: '#fff' }}>
          {doctor.avatar ? (
            <img src={doctor.avatar} alt={doctor.name} style={{ width: 100, height: 100, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 100, height: 100, borderRadius: 10, background: '#eef0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
              👨‍⚕️
            </div>
          )}
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
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={assets.info_icon} alt="" style={{ width: 14 }} />
                  <span style={{ color: '#374151', fontSize: '0.85rem', fontWeight: 500 }}>About</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: 6, maxWidth: 520, lineHeight: 1.6 }}>{doctor.bio}</p>
              </>
            )}
            <div style={{ marginTop: 8, fontSize: '0.88rem', color: '#374151' }}>
              Appointment fee: <strong style={{ color: '#5f6fff' }}>${doctor.consultationFee}</strong>
            </div>
          </div>
        </div>

        {/* Slot selector */}
        <div className="slot-section">
          <h3>Booking slots</h3>

          {/* Day selector — show dot indicator if day has availability */}
          <div className="day-slots">
            {days.map((day, i) => {
              const hasSlots = dayHasSlots(day);
              return (
                <button
                  key={day.fullDate}
                  className={`day-btn ${selectedDay === i ? 'selected' : ''}`}
                  onClick={() => handleDaySelect(i)}
                  style={{ position: 'relative', opacity: hasSlots ? 1 : 0.45 }}
                  title={hasSlots ? '' : 'No availability on this day'}
                >
                  <div style={{ fontSize: '0.72rem' }}>{day.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{day.date}</div>
                  {hasSlots && (
                    <div style={{
                      position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                      width: 5, height: 5, borderRadius: '50%',
                      background: selectedDay === i ? '#fff' : '#5f6fff',
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Time slots — only show the doctor's set slots for this day */}
          {availableSlots.length === 0 ? (
            <div style={{
              padding: '24px 20px', background: '#f9fafb', borderRadius: 10,
              textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem', marginBottom: 20,
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
              <strong>No availability on this day</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>
                This doctor has not set any time slots for {DAY_NUMBER_TO_NAME[days[selectedDay].dayNumber]}.
                Please select a different day.
              </p>
            </div>
          ) : (
            <div className="time-slots">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  className={`time-btn ${selectedTime === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {selectedTime && (
          <div style={{ background: '#eef0ff', borderRadius: 10, padding: '14px 20px', marginBottom: 20, fontSize: '0.88rem', color: '#374151' }}>
            <strong>Selected:</strong> {DAY_NUMBER_TO_NAME[days[selectedDay].dayNumber]} {days[selectedDay].date} &nbsp;|&nbsp; {selectedTime} &nbsp;|&nbsp; Fee: ${doctor.consultationFee}
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleBook}
          disabled={loading || availableSlots.length === 0}
        >
          {loading ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>
    </div>
  );
}
