from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from .models import Attendance
from .serializers import AttendanceSerializer, AttendanceSummarySerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'LECTURER':
            # Lecturers see attendance for their courses
            return Attendance.objects.filter(class_session__course__lecturer=user)
        else:  # Student
            # Students see only their own attendance
            return Attendance.objects.filter(student=user)
    
    def perform_create(self, serializer):
        # Only allow lecturers to create attendance records
        if self.request.user.role != 'LECTURER':
            raise PermissionError("Only lecturers can mark attendance")
        class_session = serializer.validated_data['class_session']
        if class_session.course.lecturer != self.request.user:
            raise PermissionError("You can only mark attendance for your courses")
        serializer.save()
    
    @action(detail=False, methods=['post'])
    def mark_attendance(self, request):
        # Mark attendance for a class session
        class_session_id = request.data.get('class_session_id')
        attendances = request.data.get('attendances', [])
        
        if not class_session_id:
            return Response({'error': 'class_session_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from scheduling.models import ClassSession
        try:
            class_session = ClassSession.objects.get(id=class_session_id)
        except ClassSession.DoesNotExist:
            return Response({'error': 'Class session not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if class_session.course.lecturer != request.user:
            return Response({'error': 'You can only mark attendance for your courses'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        created_count = 0
        for attendance_data in attendances:
            student_id = attendance_data.get('student_id')
            status_value = attendance_data.get('status')
            
            attendance, created = Attendance.objects.update_or_create(
                student_id=student_id,
                class_session=class_session,
                defaults={'status': status_value}
            )
            if created:
                created_count += 1
        
        return Response({
            'message': f'Marked attendance for {created_count} students',
            'total': len(attendances)
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        # Get attendance summary for a course
        course_id = request.query_params.get('course_id')
        
        if not course_id:
            return Response({'error': 'course_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from courses.models import Course
        from enrollments.models import Enrollment
        
        if request.user.role == 'STUDENT':
            # Students can see their own attendance summary
            attendance_records = Attendance.objects.filter(
                student=request.user,
                class_session__course_id=course_id
            )
        else:
            # Lecturers can see attendance summary for their course
            try:
                course = Course.objects.get(id=course_id)
                if course.lecturer != request.user:
                    return Response({'error': 'You can only view attendance for your courses'}, 
                                  status=status.HTTP_403_FORBIDDEN)
            except Course.DoesNotExist:
                return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
            
            attendance_records = Attendance.objects.filter(class_session__course_id=course_id)
        
        # Calculate statistics
        total_classes = attendance_records.values('class_session').distinct().count()
        present_count = attendance_records.filter(status='PRESENT').count()
        absent_count = attendance_records.filter(status='ABSENT').count()
        late_count = attendance_records.filter(status='LATE').count()
        excused_count = attendance_records.filter(status='EXCUSED').count()
        
        if total_classes == 0:
            attendance_percentage = 0
        else:
            attendance_percentage = round((present_count / total_classes) * 100, 2)
        
        summary = {
            'total_classes': total_classes,
            'present': present_count,
            'absent': absent_count,
            'late': late_count,
            'excused': excused_count,
            'attendance_percentage': attendance_percentage
        }
        
        serializer = AttendanceSummarySerializer(summary)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def student_summary(self, request):
        # Get attendance summary for student in a course
        course_id = request.query_params.get('course_id')
        
        if not course_id:
            return Response({'error': 'course_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        attendance_records = Attendance.objects.filter(
            student=request.user,
            class_session__course_id=course_id
        )
        
        # Calculate statistics
        total_classes = attendance_records.values('class_session').distinct().count()
        present_count = attendance_records.filter(status='PRESENT').count()
        absent_count = attendance_records.filter(status='ABSENT').count()
        late_count = attendance_records.filter(status='LATE').count()
        excused_count = attendance_records.filter(status='EXCUSED').count()
        
        if total_classes == 0:
            attendance_percentage = 0
        else:
            attendance_percentage = round((present_count / total_classes) * 100, 2)
        
        summary = {
            'total_classes': total_classes,
            'present': present_count,
            'absent': absent_count,
            'late': late_count,
            'excused': excused_count,
            'attendance_percentage': attendance_percentage
        }
        
        serializer = AttendanceSummarySerializer(summary)
        return Response(serializer.data)
