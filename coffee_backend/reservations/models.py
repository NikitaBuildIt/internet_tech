"""
Модели для бронирований.
Client - клиент кофейни
Reservation - бронирование столика
"""
from django.db import models
from tables.models import Table


class Client(models.Model):
    """Модель клиента - данные для бронирования."""
    name = models.CharField('Имя', max_length=200)
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Email')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Reservation(models.Model):
    """Модель бронирования столика."""
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='reservations',
        verbose_name='Клиент'
    )
    table = models.ForeignKey(
        Table,
        on_delete=models.CASCADE,
        related_name='reservations',
        verbose_name='Столик'
    )
    date = models.DateField('Дата')
    time = models.TimeField('Время')
    guests_count = models.PositiveIntegerField('Количество гостей', default=1)
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-created_at']
        unique_together = [['table', 'date', 'time']]

    def __str__(self):
        return f"{self.client.name} - {self.table} ({self.date} {self.time})"
