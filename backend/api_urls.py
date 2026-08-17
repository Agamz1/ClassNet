from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from courses.views import CourseViewSet
from enrollments.views import EnrollmentViewSet
from modules.views import ModuleViewSet, TopicViewSet
from scheduling.views import ClassSessionViewSet
from attendance.views import AttendanceViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'topics', TopicViewSet, basename='topic')
router.register(r'class-sessions', ClassSessionViewSet, basename='class-session')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]
