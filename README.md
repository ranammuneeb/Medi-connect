# MediConnect

A full-featured medical appointment booking web application built with React. Patients can browse doctors, book appointments, and manage their health schedule. Doctors can manage their availability and appointments. Admins can oversee the entire platform.

---

## Features

### Public (No Login Required)
- Landing page with hero section, speciality showcase, and top doctors
- Browse all doctors with speciality filter
- View individual doctor profiles
- About Us and Contact pages

### Patient
- Register / Login as a patient
- Browse and filter doctors by speciality
- View doctor profiles with available time slots
- Book appointments (day + time slot picker)
- View and manage appointments
- Edit personal profile

### Doctor
- Login as a doctor
- View dashboard with appointment stats
- Manage appointments (confirm / cancel)
- Update profile and availability

### Admin
- Secure admin login
- Dashboard with platform-wide stats and charts
- Manage doctors (add, edit, remove)
- View all appointments overview

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router DOM v7 |
| Styling | Bootstrap 5 + Custom CSS |
| Charts | Recharts |
| Auth | Context API + localStorage |
| Data | Static mock data (assets.js) |

---

## Project Structure

```
mediconnect/
├── public/
└── src/
    ├── assets/          # Images, SVGs, mock doctor & speciality data
    ├── components/
    │   ├── common/      # PatientNavbar, LandingNavbar, ProtectedRoute
    │   ├── admin/       # AdminSidebar
    │   └── doctor/      # DoctorSidebar
    ├── context/         # AuthContext (login, logout, role management)
    ├── pages/
    │   ├── public/      # LandingPage, PublicAboutPage, PublicContactPage
    │   ├── auth/        # LoginRegisterPage, AdminLoginPage
    │   ├── patient/     # HomePage, DoctorListingPage, DoctorProfilePage, etc.
    │   ├── doctor/      # DoctorDashboardPage, DoctorAppointmentsPage, etc.
    │   └── admin/       # AdminDashboardPage, ManageDoctorsPage, etc.
    ├── services/        # Mock API (auth, appointments, doctors)
    ├── App.jsx          # Route definitions
    ├── main.jsx         # App entry point
    └── index.css        # Custom styles (hero, cards, sidebar, footer, etc.)
```

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Redirects based on auth state |
| `/landing` | Public | Landing / home page |
| `/about` | Public | About Us page |
| `/contact` | Public | Contact page |
| `/all-doctors` | Public | Browse all doctors |
| `/all-doctors/:id` | Public | Doctor profile (login to book) |
| `/auth/login` | Public | Patient / Doctor login & register |
| `/admin/login` | Public | Admin login |
| `/patient/home` | Patient | Patient home page |
| `/patient/doctors` | Patient | Doctor listing |
| `/patient/doctors/:id` | Patient | Doctor profile + booking |
| `/patient/book/:doctorId` | Patient | Appointment booking |
| `/patient/appointments` | Patient | My appointments |
| `/patient/profile` | Patient | Patient profile |
| `/doctor/dashboard` | Doctor | Doctor dashboard |
| `/doctor/appointments` | Doctor | Doctor appointments |
| `/doctor/profile` | Doctor | Doctor profile management |
| `/admin/dashboard` | Admin | Admin dashboard |
| `/admin/doctors` | Admin | Manage doctors |
| `/admin/appointments` | Admin | Appointments overview |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Medi-connect/mediconnect

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173`

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | alice@example.com | password123 |
| Doctor | sarah.johnson@mediconnect.com | password123 |
| Admin | admin@mediconnect.com | admin123 |

---

## Team

Developed as a semester project by **Rana Muneeb** and team.
