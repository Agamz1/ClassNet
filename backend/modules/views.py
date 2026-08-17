from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Module, Topic
from .serializers import ModuleSerializer, TopicSerializer, ModuleDetailSerializer


class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ModuleDetailSerializer
        return ModuleSerializer
    
    def get_queryset(self):
        user = self.request.user
        course_id = self.request.query_params.get('course_id')
        
        if course_id:
            if user.role == 'LECTURER':
                # Lecturers can see modules for their courses
                return Module.objects.filter(course_id=course_id, course__lecturer=user)
            else:  # Student
                # Students can see modules for courses they're enrolled in
                from enrollments.models import Enrollment
                if Enrollment.objects.filter(student=user, course_id=course_id, status='ACTIVE').exists():
                    return Module.objects.filter(course_id=course_id)
                return Module.objects.none()
        return Module.objects.none()
    
    def perform_create(self, serializer):
        # Only allow lecturers to create modules
        if self.request.user.role != 'LECTURER':
            raise PermissionError("Only lecturers can create modules")
        course = serializer.validated_data['course']
        if course.lecturer != self.request.user:
            raise PermissionError("You can only create modules for your courses")
        serializer.save()


class TopicViewSet(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        module_id = self.request.query_params.get('module_id')
        
        if module_id:
            if user.role == 'LECTURER':
                # Lecturers can see topics for their modules
                return Topic.objects.filter(module_id=module_id, module__course__lecturer=user)
            else:  # Student
                # Students can see topics for their course modules
                from enrollments.models import Enrollment
                module = Module.objects.get(id=module_id)
                if Enrollment.objects.filter(student=user, course=module.course, status='ACTIVE').exists():
                    return Topic.objects.filter(module_id=module_id)
                return Topic.objects.none()
        return Topic.objects.none()
    
    def perform_create(self, serializer):
        # Only allow lecturers to create topics
        if self.request.user.role != 'LECTURER':
            raise PermissionError("Only lecturers can create topics")
        module = serializer.validated_data['module']
        if module.course.lecturer != self.request.user:
            raise PermissionError("You can only create topics for your course modules")
        serializer.save()

