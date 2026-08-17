from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Enrollment
from .serializers import EnrollmentSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'LECTURER':
            # Lecturers see enrollments for their courses
            return Enrollment.objects.filter(course__lecturer=user)
        else:  # Student
            # Students see only their own enrollments
            return Enrollment.objects.filter(student=user)
    
    def perform_create(self, serializer):
        # Only allow students to create their own enrollments
        if self.request.user.role != 'STUDENT':
            raise PermissionError("Only students can create enrollments")
        serializer.save(student=self.request.user)
    
    @action(detail=False, methods=['post'])
    def enroll(self, request):
        # Shortcut to enroll current student in a course
        course_id = request.data.get('course_id')
        if not course_id:
            return Response({'error': 'course_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data={
            'student_id': request.user.id,
            'course_id': course_id
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def unenroll(self, request, pk=None):
        enrollment = self.get_object()
        if request.user.role == 'STUDENT' and enrollment.student != request.user:
            return Response({'error': 'You can only unenroll from your own courses'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        enrollment.status = 'DROPPED'
        enrollment.save()
        return Response({'status': 'unenrolled'})

