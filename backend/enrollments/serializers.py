from rest_framework import serializers
from .models import Enrollment
from users.serializers import UserSerializer
from courses.serializers import CourseSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    course_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'student_id', 'course', 'course_id', 'status', 'enrollment_date')
        read_only_fields = ('id', 'enrollment_date')
    
    def validate(self, data):
        # Check for duplicate enrollment
        if Enrollment.objects.filter(
            student_id=data['student_id'],
            course_id=data['course_id']
        ).exists():
            raise serializers.ValidationError("Student is already enrolled in this course")
        return data
