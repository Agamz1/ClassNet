import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import { LecturerAttendance, LecturerCourses } from './pages/LecturerPages';
import {
  StudentAttendance,
  StudentCourseDetail,
  StudentCourses,
  StudentSchedule,
} from './pages/StudentPages';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/course/:courseId"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentCourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/schedule"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentAttendance />
              </ProtectedRoute>
            }
          />

          {/* Lecturer Routes */}
          <Route
            path="/lecturer/dashboard"
            element={
              <ProtectedRoute requiredRole="LECTURER">
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses"
            element={
              <ProtectedRoute requiredRole="LECTURER">
                <LecturerCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/attendance"
            element={
              <ProtectedRoute requiredRole="LECTURER">
                <LecturerAttendance />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
