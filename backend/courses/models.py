from django.db import models
from django.conf import settings


class Course(models.Model):
    course_code = models.CharField(max_length=50, unique=True)
    course_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    lecturer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_date']
    
    def __str__(self):
        return f"{self.course_code} - {self.course_name}"
