"""
Бизнес-логика бронирований.
Поиск свободного столика на дату и время.
"""
from tables.models import Table
from .models import Reservation


def find_available_table(date, time, guests_count, location=None):
    """
    Находит подходящий свободный столик.

    Алгоритм:
    1. Столик должен быть активен
    2. Количество мест >= guests_count
    3. Нет бронирований на эту дату/время (status != cancelled)
    4. Опционально: фильтр по location (зал/терраса)

    Возвращает Table или None.
    """
    # Бронирования, которые занимают столик (не отменённые)
    busy_reservations = Reservation.objects.filter(
        date=date,
        time=time
    ).exclude(
        status='cancelled'
    ).values_list('table_id', flat=True)

    # Ищем активные столики с достаточным количеством мест
    tables = Table.objects.filter(
        is_active=True,
        seats__gte=guests_count
    ).exclude(
        id__in=busy_reservations
    ).order_by('seats')  # Берём наименьший подходящий

    if location:
        tables = tables.filter(location=location)

    return tables.first()
