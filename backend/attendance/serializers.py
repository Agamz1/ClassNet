from rest_framework import serializers
from .models import Attendance
from users.serializers import UserSerializer
from scheduling.serializers import ClassSessionSerializer


class AttendanceSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    class_session = ClassSessionSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    class_session_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Attendance
        fields = ('id', 'student', 'student_id', 'class_session', 'class_session_id', 
                 'status', 'marked_at')
        read_only_fields = ('id', 'marked_at')
    
    def validate(self, data):
        # Check for duplicate attendance
        if Attendance.objects.filter(
            student_id=data['student_id'],
            class_session_id=data['class_session_id']
        ).exists():
            raise serializers.ValidationError("Attendance for this student and session already exists")
        return data


class AttendanceSummarySerializer(serializers.Serializer):
    total_classes = serializers.IntegerField()
    present = serializers.IntegerField()
    absent = serializers.IntegerField()
    late = serializers.IntegerField()
    excused = serializers.IntegerField()
    attendance_percentage = serializers.FloatField()
