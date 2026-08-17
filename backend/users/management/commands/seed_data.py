from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from users.models import CustomUser
from courses.models import Course
from enrollments.models import Enrollment
from modules.models import Module, Topic
from scheduling.models import ClassSession
from attendance.models import Attendance


class Command(BaseCommand):
    help = 'Seed the database with demo data'

    def handle(self, *args, **options):
        self.stdout.write('Starting database seed...')

        # Create lecturers
        lecturer1 = CustomUser.objects.create_user(
            username='dr_smith',
            email='smith@university.edu',
            first_name='John',
            last_name='Smith',
            password='password123',
            role='LECTURER'
        )
        
        lecturer2 = CustomUser.objects.create_user(
            username='dr_jones',
            email='jones@university.edu',
            first_name='Jane',
            last_name='Jones',
            password='password123',
            role='LECTURER'
        )
        
        self.stdout.write(self.style.SUCCESS('✓ Created lecturers'))

        # Create students
        student1 = CustomUser.objects.create_user(
            username='alice',
            email='alice@student.edu',
            first_name='Alice',
            last_name='Johnson',
            password='password123',
            role='STUDENT'
        )
        
        student2 = CustomUser.objects.create_user(
            username='bob',
            email='bob@student.edu',
            first_name='Bob',
            last_name='Williams',
            password='password123',
            role='STUDENT'
        )
        
        student3 = CustomUser.objects.create_user(
            username='charlie',
            email='charlie@student.edu',
            first_name='Charlie',
            last_name='Brown',
            password='password123',
            role='STUDENT'
        )
        
        student4 = CustomUser.objects.create_user(
            username='diana',
            email='diana@student.edu',
            first_name='Diana',
            last_name='Miller',
            password='password123',
            role='STUDENT'
        )
        
        self.stdout.write(self.style.SUCCESS('✓ Created students'))

        # Create courses
        course1 = Course.objects.create(
            course_code='CS101',
            course_name='Introduction to Computer Science',
            description='Fundamental concepts of computer science and programming',
            lecturer=lecturer1
        )
        
        course2 = Course.objects.create(
            course_code='CS201',
            course_name='Data Structures and Algorithms',
            description='Advanced concepts in data structures and algorithm design',
            lecturer=lecturer1
        )
        
        course3 = Course.objects.create(
            course_code='MATH101',
            course_name='Calculus I',
            description='Introduction to differential calculus',
            lecturer=lecturer2
        )
        
        course4 = Course.objects.create(
            course_code='MATH201',
            course_name='Linear Algebra',
            description='Vector spaces and linear transformations',
            lecturer=lecturer2
        )
        
        self.stdout.write(self.style.SUCCESS('✓ Created courses'))

        # Create enrollments
        Enrollment.objects.create(student=student1, course=course1, status='ACTIVE')
        Enrollment.objects.create(student=student1, course=course2, status='ACTIVE')
        Enrollment.objects.create(student=student2, course=course1, status='ACTIVE')
        Enrollment.objects.create(student=student2, course=course3, status='ACTIVE')
        Enrollment.objects.create(student=student3, course=course1, status='ACTIVE')
        Enrollment.objects.create(student=student3, course=course3, status='ACTIVE')
        Enrollment.objects.create(student=student4, course=course2, status='ACTIVE')
        Enrollment.objects.create(student=student4, course=course4, status='ACTIVE')
        
        self.stdout.write(self.style.SUCCESS('✓ Created enrollments'))

        # Create modules for CS101
        module1_1 = Module.objects.create(
            course=course1,
            title='Getting Started with Programming',
            description='Basic programming concepts and tools',
            order=1
        )
        
        module1_2 = Module.objects.create(
            course=course1,
            title='Variables and Data Types',
            description='Understanding variables and different data types',
            order=2
        )
        
        # Create topics for CS101 modules
        Topic.objects.create(
            module=module1_1,
            title='What is Programming?',
            description='Introduction to programming',
            content='Programming is the process of creating a set of instructions...',
            order=1
        )
        
        Topic.objects.create(
            module=module1_1,
            title='Setting Up Your Environment',
            description='Tools and setup',
            content='To start programming, you need to set up your development environment...',
            order=2
        )
        
        Topic.objects.create(
            module=module1_2,
            title='Understanding Variables',
            description='What are variables?',
            content='A variable is a named location in memory that stores a value...',
            order=1
        )
        
        self.stdout.write(self.style.SUCCESS('✓ Created modules and topics'))

        # Create class sessions
        today = timezone.now().date()
        
        # CS101 sessions
        ClassSession.objects.create(
            course=course1,
            title='CS101 - Lecture 1',
            date=today + timedelta(days=1),
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timedelta(hours=1)).time(),
            location='Room 101',
            description='Introduction to Programming'
        )
        
        session1_2 = ClassSession.objects.create(
            course=course1,
            title='CS101 - Lecture 2',
            date=today + timedelta(days=2),
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timedelta(hours=1)).time(),
            location='Room 101',
            description='Variables and Data Types'
        )
        
        session1_3 = ClassSession.objects.create(
            course=course1,
            title='CS101 - Lecture 3',
            date=today - timedelta(days=1),
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timedelta(hours=1)).time(),
            location='Room 101',
            description='Control Flow'
        )
        
        self.stdout.write(self.style.SUCCESS('✓ Created class sessions'))

        # Create attendance records
        Attendance.objects.create(student=student1, class_session=session1_3, status='PRESENT')
        Attendance.objects.create(student=student2, class_session=session1_3, status='PRESENT')
        Attendance.objects.create(student=student3, class_session=session1_3, status='ABSENT')
        Attendance.objects.create(student=student1, class_session=session1_2, status='PRESENT')
        Attendance.objects.create(student=student2, class_session=session1_2, status='LATE')
        Attendance.objects.create(student=student3, class_session=session1_2, status='PRESENT')
        
        self.stdout.write(self.style.SUCCESS('✓ Created attendance records'))

        self.stdout.write(self.style.SUCCESS(
            '\nDatabase seeding complete!\n'
            'Demo Accounts:\n'
            '  Lecturers:\n'
            '    - Username: dr_smith, Password: password123\n'
            '    - Username: dr_jones, Password: password123\n'
            '  Students:\n'
            '    - Username: alice, Password: password123\n'
            '    - Username: bob, Password: password123\n'
            '    - Username: charlie, Password: password123\n'
            '    - Username: diana, Password: password123\n'
        ))
