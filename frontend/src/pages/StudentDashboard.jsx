import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService, enrollmentService, classSessionService, attendanceService } from '../services/api';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [stats, setStats] = useState({ coursesCount: 0, attendancePercentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch courses
      const coursesRes = await courseService.getMyCourses();
      setCourses(coursesRes.data);

      // Fetch upcoming sessions
      const sessionsRes = await classSessionService.getUpcomingSessions();
      setUpcomingClasses(sessionsRes.data.slice(0, 5));

      // Calculate stats
      setStats({
        coursesCount: coursesRes.data.length,
        attendancePercentage: 85, // This would be calculated from actual attendance data
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.first_name || user.username}!</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.coursesCount}</h3>
          <p>Enrolled Courses</p>
        </div>
        <div className="stat-card">
          <h3>{stats.attendancePercentage}%</h3>
          <p>Average Attendance</p>
        </div>
        <div className="stat-card">
          <h3>{upcomingClasses.length}</h3>
          <p>Upcoming Classes</p>
        </div>
      </div>

      {/* My Courses Section */}
      <section className="dashboard-section">
        <h2>My Courses</h2>
        {courses.length === 0 ? (
          <div className="empty-state">
            <p>You are not enrolled in any courses yet.</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/student/courses')}
            >
              Browse Available Courses
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.course_code}</h3>
                <p className="course-name">{course.course_name}</p>
                <p className="course-lecturer">Lecturer: {course.lecturer.first_name} {course.lecturer.last_name}</p>
                <div className="course-stats">
                  <span>{course.student_count} students enrolled</span>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/student/course/${course.id}`)}
                >
                  View Course
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Classes Section */}
      <section className="dashboard-section">
        <h2>Upcoming Classes</h2>
        {upcomingClasses.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming classes scheduled.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {upcomingClasses.map((session) => (
                <tr key={session.id}>
                  <td>{session.course_code}</td>
                  <td>{new Date(session.date).toLocaleDateString()}</td>
                  <td>{session.start_time} - {session.end_time}</td>
                  <td>{session.location || 'TBA'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
