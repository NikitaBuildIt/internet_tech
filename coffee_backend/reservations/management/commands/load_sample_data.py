"""
Команда для загрузки тестовых данных.
Запуск: python manage.py load_sample_data
"""
from django.core.management.base import BaseCommand

from menu.models import MenuCategory, MenuItem
from tables.models import Table


class Command(BaseCommand):
    help = 'Загружает тестовые данные для CoffeeTime'

    def handle(self, *args, **options):
        self.stdout.write('Создание категорий меню...')
        cat_coffee = MenuCategory.objects.get_or_create(name='Кофе')[0]
        cat_tea = MenuCategory.objects.get_or_create(name='Чай')[0]
        cat_dessert = MenuCategory.objects.get_or_create(name='Десерты')[0]

        self.stdout.write('Создание позиций меню...')
        items_data = [
            ('Эспрессо', 'Классический эспрессо', 120, cat_coffee),
            ('Капучино', 'Капучино с молочной пенкой', 180, cat_coffee),
            ('Латте', 'Латте с нежной молочной текстурой', 200, cat_coffee),
            ('Американо', 'Американо, двойная порция эспрессо', 150, cat_coffee),
            ('Чай зелёный', 'Традиционный зелёный чай', 100, cat_tea),
            ('Чай чёрный', 'Крепкий чёрный чай', 100, cat_tea),
            ('Чизкейк', 'Классический нью-йоркский чизкейк', 250, cat_dessert),
            ('Круассан', 'Свежий круассан с маслом', 120, cat_dessert),
        ]
        for name, desc, price, cat in items_data:
            MenuItem.objects.get_or_create(
                name=name,
                category=cat,
                defaults={
                    'description': desc,
                    'price': price,
                    'is_available': True,
                }
            )

        self.stdout.write('Создание столиков...')
        tables_config = [(2, 'hall'), (2, 'hall'), (4, 'hall'), (4, 'hall'), (2, 'terrace'), (4, 'terrace')]
        if Table.objects.count() == 0:
            for seats, location in tables_config:
                Table.objects.create(seats=seats, location=location, is_active=True)

        self.stdout.write(self.style.SUCCESS('Тестовые данные загружены успешно!'))
