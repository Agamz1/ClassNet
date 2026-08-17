from rest_framework import serializers
from .models import Module, Topic


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'title', 'description', 'content', 'order', 'created_date')
        read_only_fields = ('id', 'created_date')


class ModuleSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ('id', 'course', 'title', 'description', 'order', 'topics', 'created_date')
        read_only_fields = ('id', 'created_date')


class ModuleDetailSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ('id', 'course', 'title', 'description', 'order', 'topics', 'created_date')
        read_only_fields = ('id', 'created_date')
