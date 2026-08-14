Student sees their enrolled classes 

Student sees only their own classes. The application uses a single seeded student to establish the identity represented by the enrollment view. The slice verifies correct database relationships and presentation of that student's enrollments, but does not claim to verify user authentication or authorization. 

Enrollment data comes from the database 

Enrollment data is correctly related 

The deployed view is publicly reachable 




STACK
Frontend — React + JavaScript
ClassNet will use React to build the student and lecturer interfaces, with JavaScript handling interactive features such as enrollment views, attendance interactions, class schedules, and course content. This fits the team's plan to grow ClassNet into an interactive application rather than a collection of static pages.

Backend — Python + Django REST Framework
Python and Django will provide the core application backend, while Django REST Framework (DRF) will expose the APIs that the React frontend uses to access ClassNet data. This gives the team a structured backend for managing students, lecturers, classes, enrollments, attendance, modules, and topics as the project expands.

Database — PostgreSQL (SQL)
ClassNet will use PostgreSQL as its SQL database because the application's main entities have clear relationships between them, such as students belonging to classes and attendance records belonging to students and class sessions. Starting with PostgreSQL ensures the first enrollment slice uses persistent, relational data that can support the application's later features.

Hosting — Render
Render will be used to deploy the Django backend and PostgreSQL database and make the ClassNet application accessible to reviewers through a public environment. This keeps the deployment approach manageable for the team while allowing the React frontend and Django API to be tested as a real running system.



Alternative frontend — Django Templates instead of React
The team considered using Django Templates to build the ClassNet frontend directly inside the Django application. We rejected this approach because ClassNet is expected to become an interactive student and lecturer application with features such as attendance tracking, schedules, modules, and course topics; React gives the team a clearer frontend structure for those interactive features while Django remains responsible for the backend API.


Out of Scope for the First Slice
The first ClassNet slice is intentionally limited to demonstrating a database-backed student enrollment view. The following features are explicitly out of scope:
Attendance marking or attendance tracking — students and lecturers will not record or manage attendance in this slice.
Lecturer features — no lecturer dashboard, class management, attendance management, or lecturer-specific workflows will be implemented.
Authentication beyond a single seeded student — the slice will use one predefined/seeded student and does not require a complete login, registration, password recovery, or multi-user authentication system.
Course modules and topic management — these will be addressed in later slices.
Class-period planning — scheduling and class-period management are not part of this first slice.
Notifications or messaging — communication features are deferred to later development.