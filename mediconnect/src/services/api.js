// ─── Mock Data ──────────────────────────────────────────────────────────────

export const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    location: 'New York',
    rating: 4.9,
    experience: 12,
    education: 'Harvard Medical School',
    licenseNumber: 'NY-CARD-1234',
    phone: '+1 (555) 100-0001',
    email: 'sarah.johnson@mediconnect.com',
    bio: 'Board-certified cardiologist with over 12 years of experience in treating complex heart conditions.',
    consultationFee: 150,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    availability: {
      Monday: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM'],
      Tuesday: ['09:00 AM','10:00 AM','04:00 PM'],
      Wednesday: ['11:00 AM','12:00 PM','02:00 PM'],
      Thursday: ['09:00 AM','10:00 AM','03:00 PM','04:00 PM'],
      Friday: ['09:00 AM','11:00 AM','02:00 PM'],
    },
    joinedDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    location: 'Los Angeles',
    rating: 4.8,
    experience: 9,
    education: 'Johns Hopkins University',
    licenseNumber: 'CA-NEURO-5678',
    phone: '+1 (555) 100-0002',
    email: 'michael.chen@mediconnect.com',
    bio: 'Specialist in neurological disorders including epilepsy, migraines, and multiple sclerosis.',
    consultationFee: 180,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    availability: {
      Monday: ['10:00 AM','11:00 AM','03:00 PM'],
      Tuesday: ['09:00 AM','10:00 AM','02:00 PM','04:00 PM'],
      Wednesday: ['09:00 AM','11:00 AM'],
      Thursday: ['02:00 PM','03:00 PM','04:00 PM'],
      Friday: ['09:00 AM','10:00 AM','11:00 AM'],
    },
    joinedDate: '2022-03-20',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    location: 'Chicago',
    rating: 4.9,
    experience: 7,
    education: 'Stanford University',
    licenseNumber: 'IL-PED-9012',
    phone: '+1 (555) 100-0003',
    email: 'emily.rodriguez@mediconnect.com',
    bio: 'Dedicated to providing compassionate care for children from birth through adolescence.',
    consultationFee: 120,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    availability: {
      Monday: ['09:00 AM','10:00 AM','11:00 AM'],
      Tuesday: ['02:00 PM','03:00 PM','04:00 PM'],
      Wednesday: ['09:00 AM','10:00 AM','02:00 PM'],
      Thursday: ['10:00 AM','11:00 AM','03:00 PM'],
      Friday: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM'],
    },
    joinedDate: '2022-06-01',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgeon',
    location: 'Houston',
    rating: 4.7,
    experience: 15,
    education: 'Mayo Clinic',
    licenseNumber: 'TX-ORTH-3456',
    phone: '+1 (555) 100-0004',
    email: 'james.wilson@mediconnect.com',
    bio: 'Expert in joint replacement surgery, sports injuries, and spine disorders.',
    consultationFee: 200,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    availability: {
      Monday: ['09:00 AM','02:00 PM'],
      Tuesday: ['10:00 AM','11:00 AM','03:00 PM'],
      Wednesday: ['09:00 AM','10:00 AM','04:00 PM'],
      Thursday: ['11:00 AM','02:00 PM','03:00 PM'],
      Friday: ['09:00 AM','10:00 AM'],
    },
    joinedDate: '2021-11-10',
  },
  {
    id: 5,
    name: 'Dr. Aisha Patel',
    specialty: 'Dermatologist',
    location: 'Phoenix',
    rating: 4.8,
    experience: 8,
    education: 'Columbia University',
    licenseNumber: 'AZ-DERM-7890',
    phone: '+1 (555) 100-0005',
    email: 'aisha.patel@mediconnect.com',
    bio: 'Specializes in skin disorders, cosmetic dermatology, and melanoma screening.',
    consultationFee: 140,
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
    availability: {
      Monday: ['10:00 AM','11:00 AM','02:00 PM','03:00 PM'],
      Tuesday: ['09:00 AM','04:00 PM'],
      Wednesday: ['10:00 AM','11:00 AM','02:00 PM'],
      Thursday: ['09:00 AM','10:00 AM','03:00 PM'],
      Friday: ['11:00 AM','02:00 PM','03:00 PM'],
    },
    joinedDate: '2022-02-28',
  },
  {
    id: 6,
    name: 'Dr. Robert Kim',
    specialty: 'Psychiatrist',
    location: 'New York',
    rating: 4.6,
    experience: 11,
    education: 'Yale School of Medicine',
    licenseNumber: 'NY-PSY-2345',
    phone: '+1 (555) 100-0006',
    email: 'robert.kim@mediconnect.com',
    bio: 'Provides evidence-based psychiatric care for depression, anxiety, and bipolar disorder.',
    consultationFee: 160,
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    availability: {
      Monday: ['09:00 AM','10:00 AM','02:00 PM'],
      Tuesday: ['11:00 AM','03:00 PM','04:00 PM'],
      Wednesday: ['09:00 AM','10:00 AM','11:00 AM'],
      Thursday: ['02:00 PM','03:00 PM'],
      Friday: ['09:00 AM','10:00 AM','04:00 PM'],
    },
    joinedDate: '2022-04-15',
  },
];

export const mockPatients = [
  {
    id: 'patient-1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+1 (555) 200-0001',
    role: 'patient',
    password: 'password123',
    dob: '1990-05-14',
    gender: 'Female',
    address: '123 Main St, New York, NY',
    bloodGroup: 'O+',
    avatar: 'https://randomuser.me/api/portraits/women/85.jpg',
    joinedDate: '2024-01-10',
  },
];

export const mockDoctorAccounts = [
  {
    id: 'doctor-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mediconnect.com',
    password: 'password123',
    role: 'doctor',
    doctorId: 1,
  },
  {
    id: 'doctor-2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@mediconnect.com',
    password: 'password123',
    role: 'doctor',
    doctorId: 2,
  },
];

let appointments = [
  {
    id: 'appt-1',
    patientId: 'patient-1',
    patientName: 'Alice Smith',
    patientEmail: 'alice@example.com',
    patientPhone: '+1 (555) 200-0001',
    doctorId: 1,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2026-04-10',
    time: '10:00 AM',
    symptoms: 'Chest pain and shortness of breath',
    status: 'confirmed',
    fee: 150,
    paymentStatus: 'paid',
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'appt-2',
    patientId: 'patient-1',
    patientName: 'Alice Smith',
    patientEmail: 'alice@example.com',
    patientPhone: '+1 (555) 200-0001',
    doctorId: 2,
    doctorName: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    date: '2026-03-20',
    time: '09:00 AM',
    symptoms: 'Recurring headaches',
    status: 'completed',
    fee: 180,
    paymentStatus: 'paid',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'appt-3',
    patientId: 'patient-2',
    patientName: 'Bob Johnson',
    patientEmail: 'bob@example.com',
    patientPhone: '+1 (555) 200-0002',
    doctorId: 1,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2026-04-15',
    time: '02:00 PM',
    symptoms: 'Annual cardiac checkup',
    status: 'pending',
    fee: 150,
    paymentStatus: 'paid',
    createdAt: '2026-04-02T14:00:00Z',
  },
  {
    id: 'appt-4',
    patientId: 'patient-3',
    patientName: 'Carol White',
    patientEmail: 'carol@example.com',
    patientPhone: '+1 (555) 200-0003',
    doctorId: 3,
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    date: '2026-04-08',
    time: '11:00 AM',
    symptoms: 'Child fever and cough',
    status: 'confirmed',
    fee: 120,
    paymentStatus: 'paid',
    createdAt: '2026-04-03T11:00:00Z',
  },
  {
    id: 'appt-5',
    patientId: 'patient-1',
    patientName: 'Alice Smith',
    patientEmail: 'alice@example.com',
    patientPhone: '+1 (555) 200-0001',
    doctorId: 5,
    doctorName: 'Dr. Aisha Patel',
    specialty: 'Dermatologist',
    date: '2026-03-10',
    time: '03:00 PM',
    symptoms: 'Skin rash',
    status: 'cancelled',
    fee: 140,
    paymentStatus: 'refunded',
    createdAt: '2026-03-05T15:00:00Z',
  },
];

// ─── Auth API ────────────────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const authAPI = {
  async login({ email, password, role }) {
    await delay();
    if (role === 'admin') {
      if (email === 'admin@mediconnect.com' && password === 'admin123') {
        return { id: 'admin-1', name: 'Admin User', email, role: 'admin' };
      }
      throw new Error('Invalid admin credentials');
    }
    if (role === 'doctor') {
      const doc = mockDoctorAccounts.find(
        (d) => d.email === email && d.password === password
      );
      if (!doc) throw new Error('Invalid doctor credentials');
      const doctorProfile = mockDoctors.find((d) => d.id === doc.doctorId);
      return { ...doc, avatar: doctorProfile?.avatar };
    }
    // patient
    const patient = mockPatients.find(
      (p) => p.email === email && p.password === password
    );
    if (!patient) throw new Error('Invalid credentials');
    return { ...patient, password: undefined };
  },

  async register(data) {
    await delay();
    if (data.role === 'patient') {
      const exists = mockPatients.find((p) => p.email === data.email);
      if (exists) throw new Error('Email already registered');
      const newPatient = {
        id: `patient-${Date.now()}`,
        ...data,
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: `https://randomuser.me/api/portraits/${data.gender === 'Female' ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
      };
      mockPatients.push(newPatient);
      return { ...newPatient, password: undefined };
    }
    if (data.role === 'doctor') {
      const exists = mockDoctorAccounts.find((d) => d.email === data.email);
      if (exists) throw new Error('Email already registered');
      const doctorProfile = {
        id: mockDoctors.length + 1,
        name: data.name,
        specialty: data.specialization,
        location: data.location || 'Not specified',
        rating: 4.5,
        experience: parseInt(data.experience) || 0,
        education: data.education || '',
        licenseNumber: data.licenseNumber,
        phone: data.phone,
        email: data.email,
        bio: data.bio || '',
        consultationFee: parseFloat(data.consultationFee) || 100,
        avatar: `https://randomuser.me/api/portraits/${data.gender === 'Female' ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
        availability: {},
        joinedDate: new Date().toISOString().split('T')[0],
      };
      mockDoctors.push(doctorProfile);
      const doctorAccount = {
        id: `doctor-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'doctor',
        doctorId: doctorProfile.id,
      };
      mockDoctorAccounts.push(doctorAccount);
      return { ...doctorAccount, password: undefined, avatar: doctorProfile.avatar };
    }
    throw new Error('Invalid role');
  },
};

// ─── Doctors API ─────────────────────────────────────────────────────────────
export const doctorsAPI = {
  async getAll({ search = '', specialty = '', location = '' } = {}) {
    await delay();
    let result = [...mockDoctors];
    if (search) result = result.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    if (specialty) result = result.filter((d) => d.specialty === specialty);
    if (location) result = result.filter((d) => d.location === location);
    return result;
  },
  async getById(id) {
    await delay();
    const doc = mockDoctors.find((d) => d.id === Number(id));
    if (!doc) throw new Error('Doctor not found');
    return doc;
  },
  async create(data) {
    await delay();
    const newDoc = { id: mockDoctors.length + 1, ...data, joinedDate: new Date().toISOString().split('T')[0] };
    mockDoctors.push(newDoc);
    return newDoc;
  },
  async update(id, data) {
    await delay();
    const index = mockDoctors.findIndex((d) => d.id === Number(id));
    if (index === -1) throw new Error('Doctor not found');
    mockDoctors[index] = { ...mockDoctors[index], ...data };
    return mockDoctors[index];
  },
  async delete(id) {
    await delay();
    const index = mockDoctors.findIndex((d) => d.id === Number(id));
    if (index === -1) throw new Error('Doctor not found');
    mockDoctors.splice(index, 1);
    return { success: true };
  },
};

// ─── Appointments API ─────────────────────────────────────────────────────────
export const appointmentsAPI = {
  async getAll({ patientId, doctorId, status } = {}) {
    await delay();
    let result = [...appointments];
    if (patientId) result = result.filter((a) => a.patientId === patientId);
    if (doctorId) result = result.filter((a) => a.doctorId === Number(doctorId));
    if (status) result = result.filter((a) => a.status === status);
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async book(data) {
    await delay();
    const newAppt = {
      id: `appt-${Date.now()}`,
      ...data,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    appointments.push(newAppt);
    return newAppt;
  },
  async updateStatus(id, status) {
    await delay();
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    appointments[index] = { ...appointments[index], status };
    return appointments[index];
  },
  async cancel(id) {
    return appointmentsAPI.updateStatus(id, 'cancelled');
  },
  async getBookedSlots(doctorId, date) {
    await delay(200);
    return appointments
      .filter(
        (a) =>
          a.doctorId === Number(doctorId) &&
          a.date === date &&
          a.status !== 'cancelled'
      )
      .map((a) => a.time);
  },
};

// ─── Payments API ─────────────────────────────────────────────────────────────
export const paymentsAPI = {
  async processPayment({ appointmentId, amount, cardNumber }) {
    await delay(1200);
    // Simulate 90% success rate, but if card ends in 0000 => fail
    if (cardNumber && cardNumber.endsWith('0000')) {
      throw new Error('Payment declined. Please check your card details.');
    }
    const index = appointments.findIndex((a) => a.id === appointmentId);
    if (index !== -1) {
      appointments[index].paymentStatus = 'paid';
      appointments[index].status = 'confirmed';
    }
    return { success: true, transactionId: `TXN-${Date.now()}` };
  },
};

// ─── Analytics API ────────────────────────────────────────────────────────────
export const analyticsAPI = {
  async getAdminStats() {
    await delay();
    const totalRevenue = appointments
      .filter((a) => a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.fee || 0), 0);
    return {
      totalDoctors: mockDoctors.length,
      totalPatients: mockPatients.length + 80, // include unregistered
      totalAppointments: appointments.length,
      totalRevenue,
      appointmentsByStatus: {
        confirmed: appointments.filter((a) => a.status === 'confirmed').length,
        pending: appointments.filter((a) => a.status === 'pending').length,
        completed: appointments.filter((a) => a.status === 'completed').length,
        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      },
    };
  },
  async getAppointmentsByDay() {
    await delay();
    return [
      { day: 'Mon', count: 12 },
      { day: 'Tue', count: 19 },
      { day: 'Wed', count: 8 },
      { day: 'Thu', count: 15 },
      { day: 'Fri', count: 22 },
      { day: 'Sat', count: 6 },
      { day: 'Sun', count: 3 },
    ];
  },
  async getRevenueByMonth() {
    await delay();
    return [
      { month: 'Oct', revenue: 4200 },
      { month: 'Nov', revenue: 5800 },
      { month: 'Dec', revenue: 3900 },
      { month: 'Jan', revenue: 7100 },
      { month: 'Feb', revenue: 6400 },
      { month: 'Mar', revenue: 8200 },
      { month: 'Apr', revenue: 5600 },
    ];
  },
};

export const specialties = [
  'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon',
  'Dermatologist', 'Psychiatrist', 'General Physician', 'Gynecologist',
  'Ophthalmologist', 'Dentist',
];

export const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
