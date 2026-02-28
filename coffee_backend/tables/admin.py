from django.contrib import admin
from .models import Table


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['id', 'seats', 'location', 'is_active']
    list_filter = ['location', 'is_active']
