import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  const isStudent = user.role === 'STUDENT';
  const isLecturer = user.role === 'LECTURER';

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Link to={isStudent ? '/student/dashboard' : '/lecturer/dashboard'}>
              <h1>ClassNet</h1>
            </Link>
          </div>
          <nav className="nav">
            {isStudent && (
              <>
                <Link to="/student/courses">My Courses</Link>
                <Link to="/student/schedule">Schedule</Link>
                <Link to="/student/attendance">Attendance</Link>
              </>
            )}
            {isLecturer && (
              <>
                <Link to="/lecturer/courses">My Courses</Link>
                <Link to="/lecturer/attendance">Mark Attendance</Link>
              </>
            )}
          </nav>
          <div className="user-menu">
            <span className="user-name">{user.first_name || user.username}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2026 ClassNet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
