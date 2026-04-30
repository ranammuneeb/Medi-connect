# MediConnect

A full-featured medical appointment booking web application. Patients can browse doctors, book appointments, and manage their health schedule. Doctors can manage their availability and appointments. Admins can oversee the entire platform.

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
- Payment processing after booking
- View and cancel appointments
- Edit personal profile

### Doctor
- Login as a doctor
- Dashboard with appointment stats and charts
- Manage appointments (confirm / cancel / complete)
- Update profile and weekly availability

### Admin
- Secure admin login
- Dashboard with platform-wide stats and charts (bar, line, pie)
- Manage doctors (add, edit, remove)
- View all appointments overview

---

## Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router DOM v7 |
| Styling | Bootstrap 5 + Custom CSS |
| State | Context API + React Query |
| Forms | React Hook Form |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP | Axios |

### Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| File Uploads | Multer |
| Email | Nodemailer |

---

## Project Structure

```
Medi-connect/
├── mediconnect/                  # React frontend
│   ├── public/
│   └── src/
│       ├── assets/               # Images, SVGs, speciality data
│       ├── components/
│       │   ├── common/           # PatientNavbar, LandingNavbar, ProtectedRoute
│       │   ├── admin/            # AdminSidebar
│       │   └── doctor/           # DoctorSidebar
│       ├── context/              # AuthContext (login, logout, role management)
│       ├── lib/                  # React Query client setup
│       ├── pages/
│       │   ├── public/           # LandingPage, PublicAboutPage, PublicContactPage
│       │   ├── auth/             # LoginRegisterPage, AdminLoginPage
│       │   ├── patient/          # HomePage, DoctorListingPage, BookingPage, etc.
│       │   ├── doctor/           # DoctorDashboardPage, AppointmentsPage, etc.
│       │   └── admin/            # AdminDashboardPage, ManageDoctorsPage, etc.
│       ├── services/             # API service layer (Axios calls)
│       ├── App.jsx               # Route definitions
│       ├── main.jsx              # App entry point
│       └── index.css             # Global styles + design tokens
│
└── backend/                      # Node.js + Express API
    ├── server.js                 # Express app entry point
    ├── package.json
    ├── .env                      # Environment variables
    ├── config/
    │   ├── db.js                 # MongoDB connection
    │   └── constants.js          # Roles, statuses, app constants
    ├── models/
    │   ├── User.js               # Base user schema
    │   ├── Doctor.js             # Doctor profile + availability
    │   ├── Patient.js            # Patient profile
    │   ├── Appointment.js        # Appointment record
    │   └── Payment.js            # Payment record
    ├── controllers/
    │   ├── authController.js     # login, register
    │   ├── doctorController.js   # CRUD doctors, slots
    │   ├── patientController.js  # Patient profile
    │   ├── appointmentController.js  # Book, cancel, update status
    │   ├── paymentController.js  # Process payment
    │   └── adminController.js    # Stats, manage platform
    ├── middleware/
    │   ├── authMiddleware.js     # JWT verification
    │   ├── roleMiddleware.js     # Role-based access guard
    │   ├── errorMiddleware.js    # Global error handler
    │   └── uploadMiddleware.js  # Multer avatar uploads
    ├── routes/
    │   ├── authRoutes.js         # POST /api/auth/login, /register
    │   ├── doctorRoutes.js       # /api/doctors
    │   ├── patientRoutes.js      # /api/patients
    │   ├── appointmentRoutes.js  # /api/appointments
    │   ├── paymentRoutes.js      # /api/payments
    │   └── adminRoutes.js        # /api/admin
    └── utils/
        ├── generateToken.js      # JWT signing
        ├── sendEmail.js          # Email notifications
        └── helpers.js            # Date utils, slot generation
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/login` | Public | Login (patient / doctor / admin) |
| POST | `/register` | Public | Register new patient or doctor |

### Doctors — `/api/doctors`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Public | List all doctors (filter by specialty, location) |
| GET | `/:id` | Public | Get single doctor profile |
| GET | `/:id/slots` | Public | Get available time slots for a date |
| POST | `/` | Admin | Add a new doctor |
| PUT | `/:id` | Admin / Doctor | Update doctor profile |
| DELETE | `/:id` | Admin | Remove a doctor |

### Patients — `/api/patients`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/:id` | Patient | Get patient profile |
| PUT | `/:id` | Patient | Update patient profile |

### Appointments — `/api/appointments`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/` | Patient | Book an appointment |
| GET | `/` | Patient / Doctor / Admin | List appointments (filtered by role) |
| PUT | `/:id/status` | Doctor / Admin | Update appointment status |
| DELETE | `/:id` | Patient | Cancel an appointment |

### Payments — `/api/payments`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/` | Patient | Process payment for appointment |
| GET | `/:appointmentId` | Patient | Get payment details |

### Admin — `/api/admin`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/stats` | Admin | Platform-wide stats (doctors, patients, revenue) |
| GET | `/appointments-by-day` | Admin | Chart data: daily appointments |
| GET | `/revenue-by-month` | Admin | Chart data: monthly revenue |

---

## Frontend Routes

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
| `/patient/payment/:appointmentId` | Patient | Payment |
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
- MongoDB (local or Atlas)

### Frontend

```bash
cd Medi-connect/mediconnect
npm install
npm run dev
```

Runs at `http://localhost:3000`

### Backend

```bash
cd Medi-connect/backend
npm install
# Copy .env.example to .env and fill in values
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5000`

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
```

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
