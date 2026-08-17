from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Course
from .serializers import CourseSerializer, CourseDetailSerializer
from enrollments.models import Enrollment


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'LECTURER':
            return Course.objects.filter(lecturer=user)
        else:  # Student
            return Course.objects.filter(enrollments__student=user, enrollments__status='ACTIVE').distinct()
    
    def perform_create(self, serializer):
        # Only allow lecturers to create courses
        if self.request.user.role != 'LECTURER':
            raise PermissionError("Only lecturers can create courses")
        serializer.save(lecturer=self.request.user)
    
    def perform_update(self, serializer):
        # Only allow the course lecturer to update
        if self.request.user != serializer.instance.lecturer:
            raise PermissionError("You can only update your own courses")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only allow the course lecturer to delete
        if self.request.user != instance.lecturer:
            raise PermissionError("You can only delete your own courses")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def all_courses(self, request):
        # Students can view all available courses
        courses = Course.objects.all()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def enrolled_students(self, request, pk=None):
        course = self.get_object()
        if request.user != course.lecturer:
            return Response({'error': 'You can only view enrolled students for your courses'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        enrollments = Enrollment.objects.filter(course=course, status='ACTIVE')
        students = [enrollment.student for enrollment in enrollments]
        
        from users.serializers import UserSerializer
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)
