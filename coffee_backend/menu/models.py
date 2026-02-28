"""
Модели меню кофейни.
MenuCategory - категория (кофе, выпечка и т.д.)
MenuItem - позиция меню
"""
from django.db import models


class MenuCategory(models.Model):
    """Категория меню."""
    name = models.CharField('Название', max_length=100)

    class Meta:
        verbose_name = 'Категория меню'
        verbose_name_plural = 'Категории меню'
        ordering = ['name']

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    """Позиция меню."""
    name = models.CharField('Название', max_length=200)
    description = models.TextField('Описание', blank=True)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    image = models.ImageField('Изображение', upload_to='menu/', blank=True, null=True)
    category = models.ForeignKey(
        MenuCategory,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Категория'
    )
    is_available = models.BooleanField('Доступно', default=True)

    class Meta:
        verbose_name = 'Позиция меню'
        verbose_name_plural = 'Позиции меню'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category.name})"
