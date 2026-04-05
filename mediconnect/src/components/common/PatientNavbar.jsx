import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function PatientNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

  return (
    <Navbar className="navbar-custom" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/patient/home">
          🏥 MediConnect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto gap-1">
            <Nav.Link as={Link} to="/patient/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/patient/doctors">Find Doctors</Nav.Link>
            <Nav.Link as={Link} to="/patient/appointments">My Appointments</Nav.Link>
          </Nav>
          <Nav className="align-items-center gap-2">
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2 border-0 bg-transparent">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                  alt="avatar"
                  className="avatar-circle"
                />
                <span className="fw-semibold d-none d-md-inline">{user?.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/patient/profile">My Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/patient/appointments">Appointments</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
