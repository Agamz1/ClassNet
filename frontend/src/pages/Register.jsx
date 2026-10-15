import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const getRegistrationError = (err) => {
  const data = err.response?.data;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const messages = Object.values(data).flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );
    if (messages.length > 0) return messages.join(' ');
  }
  return 'Registration failed. Please try again.';
};

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'STUDENT',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/login', {
        replace: true,
        state: { message: 'Account created. You can now log in.' },
      });
    } catch (err) {
      setError(getRegistrationError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>ClassNet</h1>
        <h2>Student &amp; Lecturer Management System</h2>

        <form onSubmit={handleSubmit}>
          <h3>Create an account</h3>
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last name</label>
            <input
              id="last_name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account type</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="STUDENT">Student</option>
              <option value="LECTURER">Lecturer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirm">Confirm password</label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              value={form.password_confirm}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
