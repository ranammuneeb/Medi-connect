import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientNavbar from '../../components/common/PatientNavbar';
import { doctors, assets } from '../../assets/assets';

// Generate next 7 days (skip Sunday)
function getNextDays() {
  const days = [];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  let d = new Date();
  d.setDate(d.getDate() + 1); // start from tomorrow
  while (days.length < 7) {
    if (d.getDay() !== 0) { // skip Sunday
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

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const days = getNextDays();

  useEffect(() => {
    const doc = doctors.find((d) => d._id === id);
    setDoctor(doc || null);
    if (doc) {
      setRelatedDoctors(doctors.filter((d) => d.speciality === doc.speciality && d._id !== id).slice(0, 5));
    }
    setSelectedDay(0);
    setSelectedTime('');
    window.scrollTo(0, 0);
  }, [id]);

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

      <div className="profile-page">
        {/* Top section */}
        <div className="profile-top">
          <img src={doctor.image} alt={doctor.name} className="profile-img" />
          <div className="profile-info">
            <div className="profile-name">
              {doctor.name}
              <img src={assets.verified_icon} alt="verified" className="verified-badge" />
            </div>
            <div className="profile-degree">
              {doctor.degree} – {doctor.speciality}
              <span className="profile-exp">{doctor.experience}</span>
            </div>
            <div className="profile-about">
              <h3>
                About{' '}
                <img src={assets.info_icon} alt="" style={{ width: 16, verticalAlign: 'middle' }} />
              </h3>
              <p>{doctor.about}</p>
            </div>
            <div className="fee-row">
              Appointment fee: <strong>${doctor.fees}</strong>
            </div>
          </div>
        </div>

        {/* Booking slots */}
        <div className="slot-section" style={{ marginBottom: 40 }}>
          <h3>Booking slots</h3>

          {/* Day selector */}
          <div className="day-slots">
            {days.map((day, i) => (
              <button
                key={day.fullDate}
                className={`day-btn ${selectedDay === i ? 'selected' : ''}`}
                onClick={() => { setSelectedDay(i); setSelectedTime(''); }}
              >
                <div style={{ fontSize: '0.75rem' }}>{day.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{day.date}</div>
              </button>
            ))}
          </div>

          {/* Time slots */}
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

          <button
            className="btn-primary"
            onClick={() => {
              if (!selectedTime) { alert('Please select a time slot'); return; }
              navigate(`/patient/book/${doctor._id}?date=${days[selectedDay].fullDate}&time=${encodeURIComponent(selectedTime)}`);
            }}
          >
            Book an appointment
          </button>
        </div>

        {/* Related doctors */}
        {relatedDoctors.length > 0 && (
          <div>
            <p className="section-title" style={{ fontSize: '1.2rem' }}>Related Doctors</p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: 20 }}>
              Simply browse through our extensive list of trusted doctors.
            </p>
            <div className="doctors-grid">
              {relatedDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="doctor-card"
                  onClick={() => navigate(`/patient/doctors/${doc._id}`)}
                >
                  <img src={doc.image} alt={doc.name} className="doctor-card-img" />
                  <div className="doctor-card-body">
                    <div className="available-dot">Available</div>
                    <div className="doctor-card-name">{doc.name}</div>
                    <div className="doctor-card-specialty">{doc.speciality}</div>
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
