import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { attendanceService, classSessionService, courseService } from '../services/api';
import './Dashboard.css';

const getList = (data) => {
  const items = Array.isArray(data) ? data : data?.results;
  if (!Array.isArray(items)) {
    throw new Error('Unexpected response format from the server');
  }
  return items;
};

const LecturerPage = ({ title, children }) => (
  <div className="dashboard">
    <h1>{title}</h1>
    {children}
  </div>
);

const RequestState = ({ loading, error }) => {
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error" role="alert">{error}</div>;
  return null;
};

export const LecturerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [studentLists, setStudentLists] = useState({});
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    courseService.getMyCourses()
      .then((response) => setCourses(getList(response.data)))
      .catch(() => setError('Failed to load your courses. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleStudents = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }
    setExpandedCourseId(courseId);
    if (studentLists[courseId]) return;

    try {
      const response = await courseService.getEnrolledStudents(courseId);
      setStudentLists((current) => ({ ...current, [courseId]: getList(response.data) }));
    } catch (err) {
      setStudentLists((current) => ({ ...current, [courseId]: null }));
    }
  };

  return (
    <LecturerPage title="My Courses">
      <RequestState loading={loading} error={error} />
      {!loading && !error && (
        courses.length === 0 ? (
          <div className="empty-state"><p>You have not created any courses yet.</p></div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <section className="course-card" key={course.id}>
                <h2>{course.course_code}</h2>
                <p className="course-name">{course.course_name}</p>
                {course.description && <p>{course.description}</p>}
                <div className="course-stats">
                  {course.student_count} active {course.student_count === 1 ? 'student' : 'students'}
                </div>
                <button
                  className="btn-primary"
                  onClick={() => toggleStudents(course.id)}
                >
                  {expandedCourseId === course.id ? 'Hide students' : 'View students'}
                </button>
                {expandedCourseId === course.id && (
                  <div className="mt-2">
                    {studentLists[course.id] === undefined ? (
                      <p>Loading students...</p>
                    ) : studentLists[course.id] === null ? (
                      <p className="error-message">Failed to load the student list.</p>
                    ) : studentLists[course.id].length === 0 ? (
                      <p>No students are enrolled in this course.</p>
                    ) : (
                      <ul>
                        {studentLists[course.id].map((student) => (
                          <li key={student.id}>
                            {student.first_name} {student.last_name} ({student.username})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>
        )
      )}
    </LecturerPage>
  );
};

const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];

export const LecturerAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    courseService.getMyCourses()
      .then((response) => setCourses(getList(response.data)))
      .catch(() => setError('Failed to load your courses. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setSessions([]);
      setSelectedSessionId('');
      setStudents([]);
      setStatuses({});
      return;
    }

    setSessionLoading(true);
    setSelectedSessionId('');
    setStudents([]);
    setStatuses({});
    classSessionService.getCourseSessiones(selectedCourseId)
      .then((response) => setSessions(getList(response.data)))
      .catch(() => {
        setSessions([]);
        setActionError('Failed to load class sessions for this course.');
      })
      .finally(() => setSessionLoading(false));
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedSessionId || !selectedCourseId) {
      setStudents([]);
      setStatuses({});
      return;
    }

    const loadRoster = async () => {
      setStudentsLoading(true);
      setActionError('');
      setSuccess('');
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          courseService.getEnrolledStudents(selectedCourseId),
          attendanceService.getAttendance(),
        ]);
        const roster = getList(studentsRes.data);
        const records = getList(attendanceRes.data);
        const existingStatuses = Object.fromEntries(
          records
            .filter((record) => record.class_session.id === Number(selectedSessionId))
            .map((record) => [record.student.id, record.status])
        );
        setStudents(roster);
        setStatuses(Object.fromEntries(
          roster.map((student) => [student.id, existingStatuses[student.id] || ''])
        ));
      } catch (err) {
        setActionError('Failed to load the enrolled students and existing attendance.');
      } finally {
        setStudentsLoading(false);
      }
    };
    loadRoster();
  }, [selectedCourseId, selectedSessionId]);

  const saveAttendance = async (event) => {
    event.preventDefault();
    setActionError('');
    setSuccess('');
    if (students.some((student) => !statuses[student.id])) {
      setActionError('Select an attendance status for every student before saving.');
      return;
    }

    setSaving(true);
    try {
      const response = await attendanceService.markAttendance({
        class_session_id: Number(selectedSessionId),
        attendances: students.map((student) => ({
          student_id: student.id,
          status: statuses[student.id],
        })),
      });
      setSuccess(response.data.message || 'Attendance saved.');
    } catch (err) {
      setActionError(err.response?.data?.detail || err.response?.data?.error || 'Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LecturerPage title="Mark Attendance">
      <RequestState loading={loading} error={error} />
      {!loading && !error && (
        <>
          {actionError && <div className="alert alert-error" role="alert">{actionError}</div>}
          {success && <div className="alert alert-success" role="status">{success}</div>}
          {courses.length === 0 ? (
            <div className="empty-state">
              <p>Create a course and schedule a class before marking attendance.</p>
              <Link to="/lecturer/courses">View my courses</Link>
            </div>
          ) : (
            <>
              <section className="dashboard-section">
                <div className="form-group">
                  <label htmlFor="attendance-course">Course</label>
                  <select
                    id="attendance-course"
                    value={selectedCourseId}
                    onChange={(event) => {
                      setActionError('');
                      setSuccess('');
                      setSelectedCourseId(event.target.value);
                    }}
                  >
                    <option value="">Choose a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.course_code} — {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCourseId && (
                  <div className="form-group">
                    <label htmlFor="attendance-session">Class session</label>
                    {sessionLoading ? (
                      <p>Loading class sessions...</p>
                    ) : (
                      <select
                        id="attendance-session"
                        value={selectedSessionId}
                        onChange={(event) => setSelectedSessionId(event.target.value)}
                      >
                        <option value="">Choose a class session</option>
                        {sessions.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.title} — {session.date} ({session.start_time})
                          </option>
                        ))}
                      </select>
                    )}
                    {!sessionLoading && sessions.length === 0 && (
                      <p>No class sessions are scheduled for this course.</p>
                    )}
                  </div>
                )}
              </section>

              {selectedSessionId && (
                <section className="dashboard-section">
                  <h2>Student attendance</h2>
                  {studentsLoading ? (
                    <div className="loading">Loading enrolled students...</div>
                  ) : students.length === 0 ? (
                    <div className="empty-state"><p>No students are enrolled in this course.</p></div>
                  ) : (
                    <form onSubmit={saveAttendance}>
                      <div className="table-responsive">
                        <table className="table">
                          <thead><tr><th>Student</th><th>Username</th><th>Status</th></tr></thead>
                          <tbody>
                            {students.map((student) => (
                              <tr key={student.id}>
                                <td>{student.first_name} {student.last_name}</td>
                                <td>{student.username}</td>
                                <td>
                                  <select
                                    aria-label={`Attendance status for ${student.username}`}
                                    value={statuses[student.id] || ''}
                                    onChange={(event) => setStatuses((current) => ({
                                      ...current,
                                      [student.id]: event.target.value,
                                    }))}
                                    required
                                  >
                                    <option value="">Select status</option>
                                    {ATTENDANCE_STATUSES.map((status) => (
                                      <option key={status} value={status}>{status}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button className="btn-primary" type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save attendance'}
                      </button>
                    </form>
                  )}
                </section>
              )}
            </>
          )}
        </>
      )}
    </LecturerPage>
  );
};
