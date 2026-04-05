# MediConnect – Online Doctor Appointment & Healthcare Management System

A full-featured frontend-only healthcare management system built with **React 18 + Vite + Bootstrap 5**.

## 🚀 Quick Start

```bash
cd mediconnect
npm install
npm run dev
```
..

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials

| Role | Email | Password | Login URL |
|------|-------|----------|-----------|
| **Patient** | alice@example.com | password123 | `/auth/login` |
| **Doctor** | sarah.johnson@mediconnect.com | password123 | `/auth/login` |
| **Admin** | admin@mediconnect.com | admin123 | `/admin/login` |

> Registering a new account via the form also works!

---

## 🏗️ Tech Stack

| Package | Purpose |
|---------|---------|
| React 18 + Vite | Core framework + build tool |
| React Router DOM | Client-side routing with role protection |
| Bootstrap 5 + react-bootstrap | UI components + responsive layout |
| @tanstack/react-query | Server state, caching, mutations |
| react-hook-form | Form handling + validation |
| react-hot-toast | Toast notifications |
| framer-motion | Page/component animations |
| recharts | Dashboard charts |
| react-datepicker | Appointment date picker |
| date-fns | Date formatting |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # PatientNavbar, ProtectedRoute, SkeletonCard
│   ├── admin/           # AdminSidebar
│   └── doctor/          # DoctorSidebar
├── pages/
│   ├── auth/            # LoginRegisterPage, AdminLoginPage
│   ├── patient/         # HomePage, DoctorListing, DoctorProfile, Booking, Payment, Appointments, Profile
│   ├── admin/           # Dashboard, ManageDoctors, AppointmentsOverview
│   └── doctor/          # Dashboard, Appointments, ProfileManage
├── context/             # AuthContext (auth + role management)
├── services/            # api.js (complete mock API with in-memory data)
├── lib/                 # queryClient.js
└── main.jsx             # App entry + providers
```

---

## 👥 User Roles & Access

### Patient (`/patient/*`)
- Home / Landing page with doctor search
- Browse & filter doctors by specialty + location
- View full doctor profiles with weekly availability
- Book appointments with date picker + time slots
- Mock payment flow (success/failure simulation)
- View upcoming/past/cancelled appointments
- Edit personal profile

### Doctor (`/doctor/*`)
- Dashboard with today's appointments + chart
- View & update appointment statuses
- Edit profile + manage weekly availability

### Admin (`/admin/*`)
- Dashboard with stats + charts (bar, pie, line)
- Full CRUD for doctors (add/edit/delete)
- View all appointments with status management

---

## 💳 Mock Payment Testing

- **Any card** → Payment succeeds  
- **Card ending in `0000`** → Payment fails  

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
