from django.db import models
from django.conf import settings
from scheduling.models import ClassSession


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('LATE', 'Late'),
        ('EXCUSED', 'Excused'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendances')
    class_session = models.ForeignKey(ClassSession, on_delete=models.CASCADE, related_name='attendances')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    marked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student', 'class_session')
        ordering = ['-marked_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.class_session.date} - {self.status}"
