# ClassNet - Student & Lecturer Management System

A comprehensive full-stack educational platform that connects lecturers and students within their classes. Built with React, Django REST Framework, and SQLite.

## Features

### Student Features
- View enrolled courses
- Browse course modules and topics  
- View course schedules
- Track attendance records
- View attendance statistics per course
- Access course materials and content

### Lecturer Features
- Create and manage courses
- View enrolled students
- Create and manage course modules and topics
- Schedule class sessions
- Record student attendance
- View attendance reports and statistics
- Manage course content

## Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - API client
- **CSS3** - Styling

### Backend
- **Python** - Programming language
- **Django** - Web framework
- **Django REST Framework** - REST API
- **SQLite** - Database

## Project Structure

```
classnet/
├── backend/
│   ├── manage.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/
│   ├── courses/
│   ├── enrollments/
│   ├── modules/
│   ├── attendance/
│   ├── scheduling/
│   ├── db.sqlite3
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, dependencies are already installed. Required packages:
- Django 6.1
- djangorestframework
- djangorestframework-simplejwt
- django-cors-headers
- python-decouple

4. **Run migrations**
```bash
python manage.py migrate
```

5. **Load seed data (optional)**
```bash
python manage.py seed_data
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

## Running the Application

### Start Django Backend

```bash
cd backend
# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
# or
source venv/bin/activate     # macOS/Linux

# Run development server
python manage.py runserver
```

Backend will be available at: http://localhost:8000
Admin panel: http://localhost:8000/admin/

### Start React Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

## Demo Accounts

### Student Accounts
- **Username:** alice | **Password:** password123
- **Username:** bob | **Password:** password123
- **Username:** charlie | **Password:** password123
- **Username:** diana | **Password:** password123

### Lecturer Accounts
- **Username:** dr_smith | **Password:** password123
- **Username:** dr_jones | **Password:** password123

## API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `GET /api/users/me/` - Get current user info

### Courses
- `GET /api/courses/` - List user's courses
- `GET /api/courses/all_courses/` - List all available courses
- `GET /api/courses/{id}/` - Get course details
- `POST /api/courses/` - Create course (lecturer only)
- `PUT /api/courses/{id}/` - Update course
- `DELETE /api/courses/{id}/` - Delete course

### Enrollments
- `GET /api/enrollments/` - List enrollments
- `POST /api/enrollments/enroll/` - Enroll in course
- `POST /api/enrollments/{id}/unenroll/` - Unenroll from course

### Modules & Topics
- `GET /api/modules/?course_id={id}` - List course modules
- `POST /api/modules/` - Create module
- `GET /api/topics/?module_id={id}` - List module topics
- `POST /api/topics/` - Create topic

### Class Sessions
- `GET /api/class-sessions/` - List class sessions
- `GET /api/class-sessions/upcoming/` - Get upcoming sessions
- `GET /api/class-sessions/today/` - Get today's sessions
- `POST /api/class-sessions/` - Create session

### Attendance
- `GET /api/attendance/` - List attendance records
- `POST /api/attendance/mark_attendance/` - Mark attendance
- `GET /api/attendance/summary/?course_id={id}` - Get attendance summary
- `GET /api/attendance/student_summary/?course_id={id}` - Get student's attendance

## Database Models

### CustomUser
- id, username, email, first_name, last_name, role (STUDENT/LECTURER)

### Course
- id, course_code, course_name, description, lecturer, created_date, updated_date

### Enrollment
- id, student, course, enrollment_date, status (ACTIVE/COMPLETED/DROPPED)

### Module
- id, course, title, description, order, created_date

### Topic
- id, module, title, description, content, order, created_date

### ClassSession
- id, course, title, date, start_time, end_time, location, description

### Attendance
- id, student, class_session, status (PRESENT/ABSENT/LATE/EXCUSED), marked_at

## Security Features

- User authentication with role-based access control
- Password hashing using Django's built-in system
- CORS configuration for frontend-backend communication
- Protected API endpoints requiring authentication
- Role-based permissions (students cannot modify lecturer content)
- Token-based authentication for API

## Development Notes

### Adding New Features
1. Create models in relevant Django app
2. Create serializers for API
3. Create views/viewsets in Django
4. Add URL routes in api_urls.py
5. Create React components for frontend
6. Connect React components to API services

### Testing the API
Use tools like:
- curl
- Postman
- Django admin panel
- REST framework browsable API at `/api/`

### Database Admin
Access Django admin at: http://localhost:8000/admin/
- Username: admin (create with `python manage.py createsuperuser`)
- Use seed_data command to create test user accounts

## Future Enhancements

- Email notifications for attendance/announcements
- File uploads for course materials
- Discussion forums per course
- Grade management system
- Prerequisite courses
- Student performance analytics
- Mobile application
- Real-time notifications
- Advanced permission system
- Course templates

## Troubleshooting

### Backend Issues
- **CORS errors:** Ensure django-cors-headers is installed and configured
- **Port already in use:** Use `python manage.py runserver 8001` for different port
- **Database errors:** Run `python manage.py migrate` again

### Frontend Issues
- **API connection failed:** Ensure backend is running on localhost:8000
- **Port 5173 in use:** Use `npm run dev -- --port 5174` for different port
- **Module not found:** Run `npm install` again

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
