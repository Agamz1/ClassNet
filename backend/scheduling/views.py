from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import ClassSession
from .serializers import ClassSessionSerializer


class ClassSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ClassSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        course_id = self.request.query_params.get('course_id')
        
        if course_id:
            if user.role == 'LECTURER':
                # Lecturers see sessions for their courses
                return ClassSession.objects.filter(course_id=course_id, course__lecturer=user).order_by('date')
            else:  # Student
                # Students see sessions for their enrolled courses
                from enrollments.models import Enrollment
                if Enrollment.objects.filter(student=user, course_id=course_id, status='ACTIVE').exists():
                    return ClassSession.objects.filter(course_id=course_id).order_by('date')
                return ClassSession.objects.none()
        return ClassSession.objects.all().order_by('date')
    
    def perform_create(self, serializer):
        # Only allow lecturers to create sessions
        if self.request.user.role != 'LECTURER':
            raise PermissionError("Only lecturers can create class sessions")
        course = serializer.validated_data['course']
        if course.lecturer != self.request.user:
            raise PermissionError("You can only create sessions for your courses")
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        # Get upcoming sessions for the current user
        today = timezone.now().date()
        
        if request.user.role == 'LECTURER':
            sessions = ClassSession.objects.filter(
                course__lecturer=request.user,
                date__gte=today
            ).order_by('date')
        else:  # Student
            from enrollments.models import Enrollment
            courses = Enrollment.objects.filter(
                student=request.user,
                status='ACTIVE'
            ).values_list('course_id', flat=True)
            sessions = ClassSession.objects.filter(
                course_id__in=courses,
                date__gte=today
            ).order_by('date')
        
        serializer = self.get_serializer(sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        # Get today's sessions
        today = timezone.now().date()
        
        if request.user.role == 'LECTURER':
            sessions = ClassSession.objects.filter(
                course__lecturer=request.user,
                date=today
            ).order_by('start_time')
        else:  # Student
            from enrollments.models import Enrollment
            courses = Enrollment.objects.filter(
                student=request.user,
                status='ACTIVE'
            ).values_list('course_id', flat=True)
            sessions = ClassSession.objects.filter(
                course_id__in=courses,
                date=today
            ).order_by('start_time')
        
        serializer = self.get_serializer(sessions, many=True)
        return Response(serializer.data)
