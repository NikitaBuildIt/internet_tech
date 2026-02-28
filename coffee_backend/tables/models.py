"""
Модель столика для кофейни.
"""
from django.db import models


class Table(models.Model):
    """Модель столика."""
    LOCATION_CHOICES = [
        ('hall', 'Зал'),
        ('terrace', 'Терраса'),
    ]

    seats = models.PositiveIntegerField('Количество мест')
    location = models.CharField(
        'Расположение',
        max_length=20,
        choices=LOCATION_CHOICES
    )
    is_active = models.BooleanField('Активен', default=True)

    class Meta:
        verbose_name = 'Столик'
        verbose_name_plural = 'Столики'

    def __str__(self):
        return f"Столик #{self.id} ({self.seats} мест, {self.get_location_display()})"
