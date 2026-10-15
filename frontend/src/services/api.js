import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/users/login/');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/users/register/', data),
  login: (username, password) => api.post('/users/login/', { username, password }),
  getCurrentUser: () => api.get('/users/me/'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const courseService = {
  getAllCourses: () => api.get('/courses/all_courses/'),
  getMyCourses: () => api.get('/courses/'),
  getCourseDetail: (id) => api.get(`/courses/${id}/`),
  createCourse: (data) => api.post('/courses/', data),
  updateCourse: (id, data) => api.put(`/courses/${id}/`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}/`),
  getEnrolledStudents: (id) => api.get(`/courses/${id}/enrolled_students/`),
};

export const enrollmentService = {
  getMyEnrollments: () => api.get('/enrollments/'),
  enrollCourse: (courseId) => api.post('/enrollments/enroll/', { course_id: courseId }),
  unenrollCourse: (enrollmentId) => api.post(`/enrollments/${enrollmentId}/unenroll/`),
};

export const moduleService = {
  getCourseModules: (courseId) => api.get('/modules/', { params: { course_id: courseId } }),
  createModule: (data) => api.post('/modules/', data),
  updateModule: (id, data) => api.put(`/modules/${id}/`, data),
  deleteModule: (id) => api.delete(`/modules/${id}/`),
};

export const topicService = {
  getModuleTopics: (moduleId) => api.get('/topics/', { params: { module_id: moduleId } }),
  createTopic: (data) => api.post('/topics/', data),
  updateTopic: (id, data) => api.put(`/topics/${id}/`, data),
  deleteTopic: (id) => api.delete(`/topics/${id}/`),
};

export const classSessionService = {
  getCourseSessiones: (courseId) => api.get('/class-sessions/', { params: { course_id: courseId } }),
  getUpcomingSessions: () => api.get('/class-sessions/upcoming/'),
  getTodaysSessions: () => api.get('/class-sessions/today/'),
  createSession: (data) => api.post('/class-sessions/', data),
  updateSession: (id, data) => api.put(`/class-sessions/${id}/`, data),
  deleteSession: (id) => api.delete(`/class-sessions/${id}/`),
};

export const attendanceService = {
  getAttendance: () => api.get('/attendance/'),
  markAttendance: (data) => api.post('/attendance/mark_attendance/', data),
  getAttendanceSummary: (courseId) => api.get('/attendance/summary/', { params: { course_id: courseId } }),
  getStudentAttendanceSummary: (courseId) => api.get('/attendance/student_summary/', { params: { course_id: courseId } }),
};

export default api;
