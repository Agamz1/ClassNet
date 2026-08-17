from rest_framework import serializers
from .models import ClassSession


class ClassSessionSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(source='course.course_code', read_only=True)
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    
    class Meta:
        model = ClassSession
        fields = ('id', 'course', 'course_code', 'course_name', 'title', 'date', 
                 'start_time', 'end_time', 'location', 'description', 'created_date')
        read_only_fields = ('id', 'created_date')
    
    def validate(self, data):
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time")
        return data
