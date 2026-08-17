from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['course_code', 'course_name', 'lecturer', 'created_date']
    list_filter = ['lecturer', 'created_date']
    search_fields = ['course_code', 'course_name']
