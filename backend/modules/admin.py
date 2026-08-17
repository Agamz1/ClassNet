from django.contrib import admin
from .models import Module, Topic


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'created_date']
    list_filter = ['course', 'created_date']
    search_fields = ['title', 'course__course_code']


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order', 'created_date']
    list_filter = ['module__course', 'created_date']
    search_fields = ['title', 'module__title']
