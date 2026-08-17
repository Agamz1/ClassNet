from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'class_session', 'status', 'marked_at']
    list_filter = ['status', 'marked_at']
    search_fields = ['student__username', 'class_session__course__course_code']
    ordering = ['-marked_at']
