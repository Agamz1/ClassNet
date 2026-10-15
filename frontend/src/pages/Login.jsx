import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const getLoginError = (err) => {
  const data = err.response?.data;
  const apiMessage = typeof data === 'string' ? data : data?.error;
  if (apiMessage?.toLowerCase() === 'invalid credentials') {
    return 'We couldn’t find an account matching that username and password. Check your details, or register for a new account.';
  }
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const messages = Object.values(data).flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );
    if (messages.length > 0) return messages.join(' ');
  }
  if (err.request && !err.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }
  return 'Login failed. Please check your username and password.';
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);
      if (response.user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (response.user.role === 'LECTURER') {
        navigate('/lecturer/dashboard');
      }
    } catch (err) {
      setError(getLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>ClassNet</h1>
        <h2>Student & Lecturer Management System</h2>
        
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>
          {location.state?.message && (
            <div className="alert alert-success" role="status">{location.state.message}</div>
          )}
          {error && (
            <div className="alert alert-error" role="alert">
              {error}{' '}
              {error.includes('register for a new account') && (
                <Link to="/register">Register here</Link>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Demo Accounts:</p>
          <p><strong>Student:</strong> Greatness / U24CS1009</p>
          <p><strong>Lecturer:</strong> Algorithm / U24CS1009</p>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
