from django.contrib import admin
from .models import ClassSession


@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'date', 'start_time', 'end_time']
    list_filter = ['course', 'date']
    search_fields = ['title', 'course__course_code']
    ordering = ['-date']
