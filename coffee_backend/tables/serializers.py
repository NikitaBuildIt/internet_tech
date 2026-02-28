"""
Сериализаторы для столиков.
"""
from rest_framework import serializers
from .models import Table


class TableSerializer(serializers.ModelSerializer):
    """Сериализатор столика."""
    location_display = serializers.CharField(source='get_location_display', read_only=True)

    class Meta:
        model = Table
        fields = ['id', 'seats', 'location', 'location_display', 'is_active']
