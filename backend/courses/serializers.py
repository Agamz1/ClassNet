from rest_framework import serializers
from .models import Course
from users.serializers import UserSerializer


class CourseSerializer(serializers.ModelSerializer):
    lecturer = UserSerializer(read_only=True)
    lecturer_id = serializers.IntegerField(write_only=True)
    student_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ('id', 'course_code', 'course_name', 'description', 'lecturer', 'lecturer_id', 
                 'student_count', 'created_date', 'updated_date')
        read_only_fields = ('id', 'created_date', 'updated_date')
    
    def get_student_count(self, obj):
        return obj.enrollments.filter(status='ACTIVE').count()


class CourseDetailSerializer(serializers.ModelSerializer):
    lecturer = UserSerializer(read_only=True)
    modules = serializers.SerializerMethodField()
    upcoming_sessions = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ('id', 'course_code', 'course_name', 'description', 'lecturer', 
                 'modules', 'upcoming_sessions', 'created_date', 'updated_date')
        read_only_fields = ('id', 'created_date', 'updated_date')
    
    def get_modules(self, obj):
        from modules.serializers import ModuleSerializer
        modules = obj.modules.all()
        return ModuleSerializer(modules, many=True).data
    
    def get_upcoming_sessions(self, obj):
        from scheduling.serializers import ClassSessionSerializer
        from django.utils import timezone
        sessions = obj.class_sessions.filter(date__gte=timezone.now().date())[:5]
        return ClassSessionSerializer(sessions, many=True).data
