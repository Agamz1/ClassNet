import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  attendanceService,
  classSessionService,
  courseService,
  enrollmentService,
} from '../services/api';

const getList = (data) => {
  const items = Array.isArray(data) ? data : data?.results;
  if (!Array.isArray(items)) {
    throw new Error('Unexpected response format from the server');
  }
  return items;
};

const StudentPage = ({ title, children }) => (
  <div className="dashboard">
    <h1>{title}</h1>
    {children}
  </div>
);

const RequestState = ({ loading, error }) => {
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  return null;
};

export const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          courseService.getAllCourses(),
          enrollmentService.getMyEnrollments(),
        ]);
        const enrollments = getList(enrollmentsRes.data);
        setCourses(getList(coursesRes.data));
        setEnrolledCourseIds(enrollments.map((enrollment) => enrollment.course?.id));
      } catch (err) {
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const enroll = async (courseId) => {
    setEnrollingId(courseId);
    setActionError('');
    try {
      await enrollmentService.enrollCourse(courseId);
      setEnrolledCourseIds((currentIds) => [...currentIds, courseId]);
    } catch (err) {
      setActionError(err.response?.data?.detail || err.response?.data?.error || 'Could not enroll in this course.');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <StudentPage title="Available Courses">
      <RequestState loading={loading} error={error} />
      {!loading && !error && (
        <>
          {actionError && <div className="alert alert-error">{actionError}</div>}
          {courses.length === 0 ? (
            <div className="empty-state"><p>No courses are available right now.</p></div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => {
                const enrolled = enrolledCourseIds.includes(course.id);
                return (
                  <div className="course-card" key={course.id}>
                    <h3>{course.course_code}</h3>
                    <p className="course-name">{course.course_name}</p>
                    <p className="course-lecturer">
                      Lecturer: {course.lecturer?.first_name} {course.lecturer?.last_name}
                    </p>
                    <p>{course.description}</p>
                    <div className="course-stats">{course.student_count} students enrolled</div>
                    {enrolled ? (
                      <span className="badge badge-success">Already enrolled</span>
                    ) : (
                      <button
                        className="btn-primary"
                        disabled={enrollingId !== null}
                        onClick={() => enroll(course.id)}
                      >
                        {enrollingId === course.id ? 'Enrolling...' : 'Enroll'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </StudentPage>
  );
};

export const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await courseService.getCourseDetail(courseId);
        setCourse(response.data);
      } catch (err) {
        setError('Failed to load this course. You may not be enrolled in it.');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

  return (
    <StudentPage title={course ? `${course.course_code}: ${course.course_name}` : 'Course Details'}>
      <RequestState loading={loading} error={error} />
      {!loading && !error && course && (
        <>
          <section className="dashboard-section">
            <p>{course.description || 'No course description provided.'}</p>
            <p className="course-lecturer">
              Lecturer: {course.lecturer?.first_name} {course.lecturer?.last_name}
            </p>
          </section>
          <section className="dashboard-section">
            <h2>Course Modules</h2>
            {course.modules.length === 0 ? (
              <div className="empty-state"><p>No modules have been added yet.</p></div>
            ) : course.modules.map((module) => (
              <div className="card" key={module.id}>
                <h3>{module.title}</h3>
                {module.description && <p>{module.description}</p>}
                {module.topics.map((topic) => (
                  <div key={topic.id}>
                    <h4>{topic.title}</h4>
                    {topic.description && <p>{topic.description}</p>}
                  </div>
                ))}
              </div>
            ))}
          </section>
          <section className="dashboard-section">
            <h2>Upcoming Classes</h2>
            {course.upcoming_sessions.length === 0 ? (
              <div className="empty-state"><p>No upcoming classes scheduled.</p></div>
            ) : (
              <ul>
                {course.upcoming_sessions.map((session) => (
                  <li key={session.id}>
                    {new Date(`${session.date}T00:00:00`).toLocaleDateString()} — {session.title},
                    {' '}{session.start_time}–{session.end_time}
                    {session.location && ` at ${session.location}`}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
      <p><Link to="/student/courses">Back to My Courses</Link></p>
    </StudentPage>
  );
};

export const StudentSchedule = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    classSessionService.getUpcomingSessions()
      .then((response) => setSessions(getList(response.data)))
      .catch(() => setError('Failed to load your schedule. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudentPage title="My Schedule">
      <RequestState loading={loading} error={error} />
      {!loading && !error && (
        sessions.length === 0 ? (
          <div className="empty-state"><p>No upcoming classes scheduled.</p></div>
        ) : (
          <table className="table">
            <thead><tr><th>Course</th><th>Class</th><th>Date</th><th>Time</th><th>Location</th></tr></thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.course_code}</td>
                  <td>{session.title}</td>
                  <td>{new Date(`${session.date}T00:00:00`).toLocaleDateString()}</td>
                  <td>{session.start_time}–{session.end_time}</td>
                  <td>{session.location || 'TBA'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </StudentPage>
  );
};

export const StudentAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    attendanceService.getAttendance()
      .then((response) => setRecords(getList(response.data)))
      .catch(() => setError('Failed to load your attendance. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudentPage title="My Attendance">
      <RequestState loading={loading} error={error} />
      {!loading && !error && (
        records.length === 0 ? (
          <div className="empty-state"><p>No attendance records have been entered yet.</p></div>
        ) : (
          <table className="table">
            <thead><tr><th>Course</th><th>Class</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.class_session.course_code}</td>
                  <td>{record.class_session.title}</td>
                  <td>{new Date(`${record.class_session.date}T00:00:00`).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </StudentPage>
  );
};
