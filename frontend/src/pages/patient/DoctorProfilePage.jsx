import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import LandingNavbar from '../../components/common/LandingNavbar';
import { useAuth } from '../../context/AuthContext';
import { doctorsAPI } from '../../services/api';
import { assets } from '../../assets/assets';

const DAY_NUMBER_TO_NAME = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
};

function getNextDays() {
  const days = [];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  let d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < 7) {
    if (d.getDay() !== 0) {
      days.push({
        label: dayNames[d.getDay()],
        date: d.getDate(),
        fullDate: d.toISOString().split('T')[0],
        dayNumber: d.getDay(),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const days = getNextDays();

  useEffect(() => {
    setLoading(true);
    setSelectedDay(0);
    setSelectedTime('');
    window.scrollTo(0, 0);
    doctorsAPI.getById(id)
      .then((doc) => {
        setDoctor(doc);
        return doctorsAPI.getAll({ specialty: doc.specialty });
      })
      .then((all) => {
        setRelatedDoctors(all.filter((d) => d._id !== id).slice(0, 5));
      })
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);


  const getAvailableSlots = () => {
    if (!doctor?.availability) return [];
    const dayName = DAY_NUMBER_TO_NAME[days[selectedDay].dayNumber];
    return doctor.availability[dayName] || [];
  };

  const dayHasSlots = (dayObj) => {
    if (!doctor?.availability) return false;
    const dayName = DAY_NUMBER_TO_NAME[dayObj.dayNumber];
    return (doctor.availability[dayName] || []).length > 0;
  };

  const availableSlots = getAvailableSlots();

  const Navbar = user ? PatientNavbar : LandingNavbar;

  if (loading) return <div><Navbar /><div className="text-center py-5 text-muted"><h2>Loading...</h2></div></div>;
  if (!doctor) return <div><Navbar /><div className="text-center py-5 text-muted"><h2>Doctor not found</h2></div></div>;

  return (
    <div>
      <Navbar />

      <div className="profile-page">
        {}
        <div className="profile-top">
          {doctor.avatar ? (
            <img src={doctor.avatar} alt={doctor.name} className="profile-img" />
          ) : (
            <div className="profile-img" style={{ background: '#eef0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              👨‍⚕️
            </div>
          )}
          <div className="profile-info">
            <div className="profile-name">
              {doctor.name}
              <img src={assets.verified_icon} alt="verified" className="verified-badge" />
            </div>
            <div className="profile-degree">
              {doctor.specialty}
              {doctor.experience > 0 && <span className="profile-exp">{doctor.experience} yrs exp.</span>}
            </div>
            <div className="profile-about">
              <h3>About <img src={assets.info_icon} alt="" style={{ width: 16, verticalAlign: 'middle' }} /></h3>
              <p>{doctor.bio || 'No bio provided yet.'}</p>
            </div>
            <div className="fee-row">
              Appointment fee: <strong>${doctor.consultationFee}</strong>
            </div>
          </div>
        </div>

        {}
        <div className="slot-section" style={{ marginBottom: 40 }}>
          <h3>Booking slots</h3>

          {}
          <div className="day-slots">
            {days.map((day, i) => {
              const hasSlots = dayHasSlots(day);
              return (
                <button
                  key={day.fullDate}
                  className={`day-btn ${selectedDay === i ? 'selected' : ''}`}
                  onClick={() => { setSelectedDay(i); setSelectedTime(''); }}
                  style={{ position: 'relative', opacity: hasSlots ? 1 : 0.4 }}
                  title={hasSlots ? `${DAY_NUMBER_TO_NAME[day.dayNumber]} — available` : 'No availability'}
                >
                  <div style={{ fontSize: '0.75rem' }}>{day.label}</div>
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

          {}
          {availableSlots.length === 0 ? (
            <div style={{
              padding: '20px', background: '#f9fafb', borderRadius: 10,
              textAlign: 'center', color: '#9ca3af', fontSize: '0.88rem', margin: '12px 0',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>📅</div>
              <strong>No availability on {DAY_NUMBER_TO_NAME[days[selectedDay].dayNumber]}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Please select another day.</p>
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

          <button
            className="btn rounded-pill"
            style={{ background: '#5f6fff', color: '#fff', border: 'none', opacity: availableSlots.length === 0 ? 0.5 : 1 }}
            disabled={availableSlots.length === 0}
            onClick={() => {
              if (!user) { navigate('/auth/login'); return; }
              if (!selectedTime) { alert('Please select a time slot'); return; }
              navigate(`/patient/book/${doctor._id}?date=${days[selectedDay].fullDate}&time=${encodeURIComponent(selectedTime)}`);
            }}
          >
            {user ? 'Book an appointment' : 'Login to Book'}
          </button>
        </div>

        {}
        {relatedDoctors.length > 0 && (
          <div>
            <p className="h5 fw-bold mb-2">Related Doctors</p>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Simply browse through our extensive list of trusted doctors.</p>
            <div className="doctors-grid">
              {relatedDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="doctor-card"
                  onClick={() => navigate(user ? `/patient/book/${doc._id}` : `/all-doctors/${doc._id}`)}
                >
                  {doc.avatar ? (
                    <img src={doc.avatar} alt={doc.name} className="doctor-card-img" />
                  ) : (
                    <div className="doctor-card-img" style={{ background: '#eef0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👨‍⚕️</div>
                  )}
                  <div className="doctor-card-body">
                    <div className="available-dot">Available</div>
                    <div className="doctor-card-name">{doc.name}</div>
                    <div className="doctor-card-specialty">{doc.specialty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
