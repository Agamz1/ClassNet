import React, { useEffect, useState } from 'react';
import { attendanceService, classSessionService, courseService } from '../services/api';
import './Dashboard.css';

const getList = (data) => {
  const items = Array.isArray(data) ? data : data?.results;
  if (!Array.isArray(items)) {
    throw new Error('Unexpected response format from the server');
  }
  return items;
};

const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString();

const LecturerDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [coursesRes, sessionsRes, attendanceRes] = await Promise.all([
          courseService.getMyCourses(),
          classSessionService.getUpcomingSessions(),
          attendanceService.getAttendance(),
        ]);
        setCourses(getList(coursesRes.data));
        setUpcomingSessions(getList(sessionsRes.data).slice(0, 5));
        setAttendanceRecords(getList(attendanceRes.data));
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const enrollmentCount = courses.reduce(
    (total, course) => total + (course.student_count || 0),
    0
  );
  const presentCount = attendanceRecords.filter((record) => record.status === 'PRESENT').length;
  const attendancePercentage = attendanceRecords.length
    ? Math.round((presentCount / attendanceRecords.length) * 100)
    : 0;
  const recentAttendance = attendanceRecords.slice(0, 5);

  return (
    <div className="dashboard">
      <h1>Lecturer Dashboard</h1>
      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{courses.length}</h3>
          <p>My Courses</p>
        </div>
        <div className="stat-card">
          <h3>{enrollmentCount}</h3>
          <p>Active Enrollments</p>
        </div>
        <div className="stat-card">
          <h3>{upcomingSessions.length}</h3>
          <p>Upcoming Classes</p>
        </div>
        <div className="stat-card">
          <h3>{attendancePercentage}%</h3>
          <p>Attendance Recorded as Present</p>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>My Courses</h2>
        {courses.length === 0 ? (
          <div className="empty-state"><p>You have not created any courses yet.</p></div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <article className="course-card" key={course.id}>
                <h3>{course.course_code}</h3>
                <p className="course-name">{course.course_name}</p>
                {course.description && <p>{course.description}</p>}
                <div className="course-stats">
                  {course.student_count} active {course.student_count === 1 ? 'student' : 'students'}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Upcoming Classes</h2>
        {upcomingSessions.length === 0 ? (
          <div className="empty-state"><p>No upcoming classes scheduled.</p></div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>Course</th><th>Class</th><th>Date</th><th>Time</th><th>Location</th></tr>
              </thead>
              <tbody>
                {upcomingSessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.course_code}</td>
                    <td>{session.title}</td>
                    <td>{formatDate(session.date)}</td>
                    <td>{session.start_time}–{session.end_time}</td>
                    <td>{session.location || 'TBA'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Recent Attendance</h2>
        {recentAttendance.length === 0 ? (
          <div className="empty-state"><p>No attendance has been recorded yet.</p></div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>Student</th><th>Course</th><th>Class</th><th>Status</th><th>Marked</th></tr>
              </thead>
              <tbody>
                {recentAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student.first_name} {record.student.last_name}</td>
                    <td>{record.class_session.course_code}</td>
                    <td>{record.class_session.title}</td>
                    <td>{record.status}</td>
                    <td>{new Date(record.marked_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default LecturerDashboard;
