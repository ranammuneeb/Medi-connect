import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { motion } from 'framer-motion';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import PatientNavbar from '../../components/common/PatientNavbar';
import { doctorsAPI, appointmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AppointmentBookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const { data: doctor } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => doctorsAPI.getById(doctorId),
  });

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const dayName = selectedDate ? dayNames[selectedDate.getDay()] : '';
  const availableSlots = doctor?.availability?.[dayName] || [];

  const { data: bookedSlots = [] } = useQuery({
    queryKey: ['bookedSlots', doctorId, formattedDate],
    queryFn: () => appointmentsAPI.getBookedSlots(doctorId, formattedDate),
    enabled: !!(doctorId && formattedDate),
  });

  const { mutate: bookAppointment, isPending } = useMutation({
    mutationFn: (data) =>
      appointmentsAPI.book({
        patientId: user.id,
        patientName: data.name,
        patientEmail: data.email,
        patientPhone: data.phone,
        symptoms: data.symptoms,
        doctorId: Number(doctorId),
        doctorName: doctor?.name,
        specialty: doctor?.specialty,
        date: formattedDate,
        time: selectedSlot,
        fee: doctor?.consultationFee,
      }),
    onSuccess: (appointment) => {
      toast.success('Appointment booked! Redirecting to payment...');
      navigate(`/patient/payment/${appointment.id}`);
    },
    onError: (err) => toast.error(err.message || 'Booking failed'),
  });

  const onSubmit = (data) => {
    if (!selectedDate) { toast.error('Please select a date'); return; }
    if (!selectedSlot) { toast.error('Please select a time slot'); return; }
    bookAppointment(data);
  };

  return (
    <div>
      <PatientNavbar />

      <div style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', padding: '30px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>
            📅 Book Appointment
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
            with {doctor?.name || '...'}
          </p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Doctor Summary */}
          {doctor && (
            <div className="col-md-4">
              <div className="card p-4 text-center sticky-top" style={{ top: 80 }}>
                <img src={doctor.avatar} alt={doctor.name} className="rounded-circle mx-auto mb-3"
                  style={{ width: 90, height: 90, objectFit: 'cover', border: '3px solid #e0f2fe' }} />
                <span className="specialty-chip mb-2">{doctor.specialty}</span>
                <h5 className="fw-bold mt-2">{doctor.name}</h5>
                <p className="text-muted" style={{ fontSize: '0.88rem' }}>📍 {doctor.location}</p>
                <div className="d-flex justify-content-center gap-3 mt-2">
                  <div className="text-center">
                    <div className="fw-bold text-primary">{doctor.experience}+</div>
                    <small className="text-muted">Yrs Exp</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold text-primary">⭐ {doctor.rating}</div>
                    <small className="text-muted">Rating</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold text-primary">${doctor.consultationFee}</div>
                    <small className="text-muted">Fee</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="col-md-8">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Step 1: Date */}
              <div className="card p-4 mb-4">
                <h5 className="fw-bold mb-3">📅 Step 1: Select Date</h5>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => { setSelectedDate(date); setSelectedSlot(''); }}
                  minDate={addDays(new Date(), 1)}
                  placeholderText="Choose appointment date"
                  dateFormat="MMMM d, yyyy"
                  filterDate={(date) => date.getDay() !== 0} // No Sundays
                  inline
                />
              </div>

              {/* Step 2: Time Slot */}
              {selectedDate && (
                <div className="card p-4 mb-4">
                  <h5 className="fw-bold mb-3">🕐 Step 2: Select Time Slot ({dayName})</h5>
                  {availableSlots.length === 0 ? (
                    <div className="alert alert-warning">
                      No available slots for {dayName}. Please select another date.
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap">
                      {availableSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            className={`time-slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {isBooked ? `${slot} (booked)` : slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Patient Details */}
              <div className="card p-4 mb-4">
                <h5 className="fw-bold mb-3">👤 Step 3: Your Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name', { required: 'Name is required' })} />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email *</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      {...register('phone', { required: 'Phone is required' })} />
                    {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Appointment Summary</label>
                    <div className="form-control bg-light" style={{ fontSize: '0.88rem' }}>
                      {selectedDate && selectedSlot
                        ? `${format(selectedDate, 'MMM d, yyyy')} at ${selectedSlot}`
                        : 'Select date & time above'}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Symptoms / Notes</label>
                    <textarea className="form-control" rows={3} placeholder="Briefly describe your symptoms or reason for visit..."
                      {...register('symptoms')} />
                  </div>
                </div>
              </div>

              {/* Summary & Submit */}
              {selectedDate && selectedSlot && (
                <div className="card p-4 mb-4" style={{ border: '2px solid #0d6efd' }}>
                  <h6 className="fw-bold mb-3">📋 Appointment Summary</h6>
                  <div className="row g-2" style={{ fontSize: '0.9rem' }}>
                    <div className="col-6"><span className="text-muted">Doctor:</span> <strong>{doctor?.name}</strong></div>
                    <div className="col-6"><span className="text-muted">Specialty:</span> <strong>{doctor?.specialty}</strong></div>
                    <div className="col-6"><span className="text-muted">Date:</span> <strong>{format(selectedDate, 'MMM d, yyyy')}</strong></div>
                    <div className="col-6"><span className="text-muted">Time:</span> <strong>{selectedSlot}</strong></div>
                    <div className="col-6"><span className="text-muted">Consultation Fee:</span> <strong className="text-primary">${doctor?.consultationFee}</strong></div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100 py-3" disabled={isPending} style={{ fontSize: '1.1rem' }}>
                {isPending ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Booking...</>
                ) : '💳 Proceed to Payment'}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}
