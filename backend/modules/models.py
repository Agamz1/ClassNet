from django.db import models
from courses.models import Course


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_date']
    
    def __str__(self):
        return f"{self.course.course_code} - {self.title}"


class Topic(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    content = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_date']
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"
