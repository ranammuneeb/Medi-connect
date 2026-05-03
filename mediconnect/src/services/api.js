import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('mediconnect_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authAPI = {
  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const doctorsAPI = {
  async getAll(params = {}) {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  async create(data) {
    const response = await api.post('/doctors', data);
    return response.data;
  },
  async update(id, data) {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  },
};

export const appointmentsAPI = {
  async getAll(params = {}) {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
  async book(data) {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  async updateStatus(id, status) {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },
  async cancel(id) {
    return this.updateStatus(id, 'cancelled');
  },
  async getBookedSlots(doctorId, date) {
    const response = await api.get(`/appointments/slots/${doctorId}/${date}`);
    return response.data;
  },
};

export const paymentsAPI = {
  async processPayment(data) {
    const response = await api.post('/payments/process', data);
    return response.data;
  },
  async confirmPayment(appointmentId) {
    const response = await api.post('/payments/confirm', { appointmentId });
    return response.data;
  }
};

export const analyticsAPI = {
  async getAdminStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  async getAppointmentsByDay() {
    const response = await api.get('/admin/appointments-by-day');
    return response.data;
  },
  async getRevenueByMonth() {
    const response = await api.get('/admin/revenue-by-month');
    return response.data;
  },
};

export const specialties = [
  'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon',
  'Dermatologist', 'Psychiatrist', 'General Physician', 'Gynecologist',
  'Ophthalmologist', 'Dentist',
];

export const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
