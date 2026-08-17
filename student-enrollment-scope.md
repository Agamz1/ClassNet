# ClassNet Application Specification

You are the lead developer responsible for building and implementing the complete **ClassNet** application.

Do not build only a prototype or a first-slice demonstration. Build the application as a functional full-stack product based on the requirements below.

The application should be structured cleanly so that features can be expanded later, but the goal of this task is to implement the major ClassNet functionality now.

## 1. Product Overview
**ClassNet** is an educational platform that connects lecturers and students within their classes.

The platform should allow students to:

- View their enrolled classes
- View class information
- View course modules
- View course topics
- View class schedules
- View attendance information
- Track their attendance
- Access relevant course information

Lecturers should be able to:

- Create and manage classes
- View students enrolled in their classes
- Manage class schedules
- Create and manage course modules
- Create and manage course topics
- Record student attendance
- View attendance information
- Manage their course content

The application should provide separate experiences for students and lecturers.

---

## 2. Technology Stack
Use the following stack.

### Frontend

- React
- JavaScript
- HTML
- CSS

Use React to create the user interface and interactive dashboards.

Do not use Django templates as the primary frontend.

### Backend

- Python
- Django
- Django REST Framework

Django should provide the backend, business logic, database access, authentication, and REST APIs.

### Database
Use:

**SQLite**

Use Django's ORM for all database access.

Do not hardcode application data into React components.

The database should contain the application's students, lecturers, courses, enrollments, modules, topics, class sessions, and attendance records.

Keep the database configuration simple enough for local development.

### Hosting
Structure the application so it can later be deployed to Render.

For now, prioritize getting the complete application working locally.

---

## 3. Application Architecture
Use a clear separation:

```
React frontend
    ↓
Django REST Framework API
    ↓
Django ORM
    ↓
SQLite
```

Organize the Django backend into logical applications where appropriate.

A reasonable structure is:

```
classnet/
backend/
    manage.py
    config/
    users/
    courses/
    enrollments/
    attendance/
    scheduling/
    modules/
    api/

frontend/
    package.json
    src/
        components/
        pages/
        layouts/
        services/
        hooks/
        context/
        App.jsx
```

The exact structure may be improved if you have a better Django/React architecture, but keep the code understandable.

---

## 4. Authentication
Implement proper authentication.

There should be two user roles:

### Student
Students can:

- Log in
- View their dashboard
- View their enrolled classes
- View course information
- View modules and topics
- View schedules
- View attendance records

### Lecturer
Lecturers can:

- Log in
- View their dashboard
- Create/manage classes
- View enrolled students
- Create/manage modules
- Create/manage topics
- Create class sessions
- Record attendance
- View attendance statistics

Use Django authentication and Django REST Framework authentication.

Use a secure authentication approach appropriate for a React frontend.

Do not store passwords in plaintext.

Implement role-based access control.

A student must not be able to access lecturer-only functionality.

A lecturer must not be able to access another lecturer's private management functionality unless explicitly permitted by the application rules.

---

## 5. Database Models
Create the necessary Django models.

### User
Use Django's custom user model where appropriate.

Include:

- id
- name
- email
- password
- role

Roles:

- STUDENT
- LECTURER

### Course/Class
Include:

- id
- course code
- course name
- description
- lecturer
- created date
- updated date

A lecturer can manage the classes they teach.

### Enrollment
Include:

- id
- student
- course
- enrollment date
- status

Prevent duplicate enrollment records for the same student and course.

### Module
Include:

- id
- course
- title
- description
- order
- created date

A course can contain multiple modules.

### Topic
Include:

- id
- module
- title
- description
- content
- order
- created date

A module can contain multiple topics.

### Class Session
Include:

- id
- course
- title
- date
- start time
- end time
- location
- description

Class sessions represent scheduled periods/classes.

### Attendance
Include:

- id
- student
- class session
- status
- marked at

Attendance statuses should include:

- PRESENT
- ABSENT
- LATE
- EXCUSED

Prevent duplicate attendance records for the same student and class session.

Add appropriate relationships, constraints, indexes, and validation.

---

## 6. Student Dashboard
Build a polished student dashboard.

The dashboard should display:

- Student name
- Number of enrolled courses
- Upcoming classes
- Attendance summary
- Recent courses
- Quick links

Create pages for:

### My Classes
Display all courses the logged-in student is enrolled in.

Each course should show:

- Course code
- Course name
- Lecturer
- Description
- Attendance percentage

### Course Details
Display:

- Course information
- Lecturer
- Modules
- Topics
- Upcoming class sessions
- Attendance information

### Modules
Allow the student to browse course modules.

### Topics
Allow students to open individual topics and view their content.

### Schedule
Display upcoming class sessions in a useful calendar/list format.

### Attendance
Display:

- Total classes
- Present
- Absent
- Late
- Excused
- Attendance percentage

Also display attendance by course.

---

## 7. Lecturer Dashboard
Build a lecturer dashboard.

Display:

- Lecturer name
- Number of courses
- Number of students
- Upcoming class sessions
- Attendance overview

Create lecturer pages for:

### My Courses
Show all courses taught by the lecturer.

### Course Management
Allow the lecturer to:

- Create course
- Edit course
- Delete course where appropriate
- View enrolled students

### Student Management
Display students enrolled in a lecturer's course.

### Module Management
Allow lecturers to:

- Create modules
- Edit modules
- Delete modules
- Reorder modules

### Topic Management
Allow lecturers to:

- Create topics
- Edit topics
- Delete topics
- Reorder topics
- Add topic content

### Class Scheduling
Allow lecturers to:

- Create class sessions
- Edit sessions
- Delete sessions
- Set date/time
- Set location
- Add descriptions

### Attendance Management
Allow lecturers to:

- Select a class session
- View enrolled students
- Mark students present
- Mark students absent
- Mark students late
- Mark students excused
- Update attendance
- View attendance statistics

---

## 8. Course Enrollment
Implement enrollment functionality.

Students should be able to see the courses they are enrolled in.

Lecturers should be able to see the students enrolled in their courses.

Prevent duplicate enrollments.

Ensure users cannot access enrollment information they are not authorized to view.

---

## 9. Attendance System
Implement a complete attendance system.

For every class session, the lecturer should be able to see the enrolled students and record attendance.

Attendance should support:

- Present
- Absent
- Late
- Excused

Calculate attendance percentages automatically.

Example:

```
Attendance percentage = (number of Present sessions / applicable sessions) × 100
```

Display attendance information on the student dashboard and course pages.

---

## 10. Scheduling
Implement class-period planning.

Lecturers should be able to create class sessions with:

- Course
- Date
- Start time
- End time
- Location
- Description

Students should be able to view their upcoming classes.

Prevent obviously invalid schedules, such as an end time occurring before the start time.

---

## 11. Modules and Topics
Implement course content management.

Course hierarchy:

```
Course
→ Modules
→ Topics
```

Lecturers can create and manage modules and topics.

Students can view published course content.

Keep the content model flexible enough for future additions.

---

## 12. REST API
Create a clean REST API using Django REST Framework.

Provide appropriate endpoints for:

- Authentication
- Users
- Students
- Lecturers
- Courses
- Enrollments
- Modules
- Topics
- Class sessions
- Attendance

Use serializers.

Use appropriate HTTP methods:

- GET
- POST
- PUT/PATCH
- DELETE

Use appropriate HTTP status codes.

Protect endpoints according to user roles.

Do not expose sensitive user information through the API.

---

## 13. React Frontend
Create a professional React interface.

Use reusable components for:

- Navigation
- Sidebar
- Header
- Cards
- Tables
- Forms
- Modals
- Loading states
- Error messages
- Empty states
- Confirmation dialogs

Create separate dashboard layouts for:

- Students
- Lecturers

The UI should be responsive and work well on:

- Desktop
- Tablet
- Mobile

Use a consistent design system throughout the application.

Do not make every page visually different.

---

## 14. Forms and Validation
All major forms should include validation.

Examples:

**Course creation:**

- Course code required
- Course name required

**Class session:**

- Date required
- Start time required
- End time required
- End time must be after start time

**Enrollment:**

- Student required
- Course required
- Duplicate enrollment prevented

**Topic:**

- Title required
- Module required

Display useful validation errors to the user.

---

## 15. API Error Handling
The React application must handle:

- Loading
- Successful responses
- Empty results
- Validation errors
- Authentication errors
- Permission errors
- Server errors
- Network failures

Do not silently swallow errors.

Show useful messages to users.

---

## 16. Database Seed Data
Create a repeatable Django seed mechanism.

Include realistic demo data.

Create at least:

### Students
3–5 students.

### Lecturers
2–3 lecturers.

### Courses
At least 4 courses.

### Enrollments
Create realistic student/course relationships.

### Modules
Create multiple modules for several courses.

### Topics
Create multiple topics under the modules.

### Class Sessions
Create upcoming and previous class sessions.

### Attendance
Create realistic attendance records for students.

Create demo accounts for both roles.

Clearly document the credentials in the development README.

Do not use real people's information.

---

## 17. Security
Follow reasonable security practices.

- Use Django's password hashing.
- Never store plaintext passwords.
- Never commit secrets.
- Use environment variables for sensitive configuration.
- Implement role-based permissions.
- Validate API input.
- Prevent unauthorized course access.
- Prevent students from modifying attendance.
- Prevent students from modifying lecturer-owned course content.
- Prevent users from accessing another user's private information.

---

## 18. Testing
Create meaningful automated tests.

**Backend tests should cover:**

- Authentication
- Role permissions
- Course creation
- Enrollment
- Duplicate enrollment prevention
- Module creation
- Topic creation
- Class session creation
- Attendance marking
- Attendance calculations
- Unauthorized access

**Frontend tests should cover important user flows such as:**

- Login
- Student dashboard
- Viewing courses
- Viewing course details
- Viewing attendance
- Lecturer dashboard
- Course management
- Attendance management

Prioritize testing core business logic over superficial UI tests.

---

## 19. README
Create a comprehensive README.

Include:

### ClassNet
Explain the application.

### Features
Document the student and lecturer functionality.

### Technology Stack

- React
- JavaScript
- Python
- Django
- Django REST Framework
- SQLite

### Project Structure
Explain the frontend and backend directories.

### Installation
Explain everything needed to run the project locally.

Include:

- Python virtual environment
- Backend dependencies
- Node dependencies
- SQLite setup
- Migrations
- Seed data

### Running the Application
Explain how to start:

- Django backend
- React frontend

### Demo Accounts
Document the seeded student and lecturer accounts.

### API
Document the major API endpoints.

### Testing
Explain how to run backend and frontend tests.

---

## 20. Development Process
Do not generate a huge amount of disconnected code without verifying it.

Work through the implementation systematically.

Start by inspecting the existing repository.

Then:

1. Set up the Django backend.
2. Configure SQLite.
3. Create the custom user model and roles.
4. Create the course/enrollment models.
5. Create module/topic models.
6. Create scheduling models.
7. Create attendance models.
8. Create migrations.
9. Create seed data.
10. Implement authentication.
11. Implement permissions.
12. Implement REST APIs.
13. Test the backend.
14. Set up React.
15. Build authentication screens.
16. Build student dashboard.
17. Build student course pages.
18. Build student attendance and schedule pages.
19. Build lecturer dashboard.
20. Build lecturer course management.
21. Build module/topic management.
22. Build scheduling management.
23. Build attendance management.
24. Connect all React pages to the API.
25. Add loading/error/empty states.
26. Add frontend tests.
27. Run the complete application.
28. Fix errors and broken flows.
29. Update the README.
30. Verify that the complete ClassNet application works from login through the major student and lecturer workflows.

---

## 21. Important Rules
Do not:

- Use hardcoded course data in React.
- Use fake API responses in the finished application.
- Put database logic inside React.
- Put large amounts of frontend HTML inside Django templates.
- Store passwords in plaintext.
- Skip migrations.
- Skip validation.
- Build features that cannot communicate with the backend.
- Leave major features as empty placeholder pages.

When you create a feature, implement the complete flow:

**Database → Django model → API → React service → React UI**

The finished application should be functional rather than a collection of static screens.

If you discover an architectural problem, fix it rather than working around it with hardcoded data.

Prioritize correctness, maintainability, security, and a coherent user experience.

Start by inspecting the current repository and then implement ClassNet systematically.
