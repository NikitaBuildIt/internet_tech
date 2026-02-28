from django.contrib import admin
from .models import Client, Reservation


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'created_at']
    search_fields = ['name', 'phone', 'email']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['client', 'table', 'date', 'time', 'guests_count', 'status', 'created_at']
    list_filter = ['status', 'date']
    search_fields = ['client__name', 'client__phone']
