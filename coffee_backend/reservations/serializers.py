"""
Сериализаторы для бронирований.
"""
from datetime import time, date, datetime
from django.utils import timezone
from rest_framework import serializers
from .models import Client, Reservation
from tables.models import Table


# Режим работы: Пн–Пт 8:00–22:00, Сб–Вс 9:00–23:00
WORKING_HOURS_WEEKDAY = (time(8, 0), time(22, 0))
WORKING_HOURS_WEEKEND = (time(9, 0), time(23, 0))


class ClientSerializer(serializers.ModelSerializer):
    """Сериализатор клиента."""
    class Meta:
        model = Client
        fields = ['id', 'name', 'phone', 'email', 'created_at']


class ReservationListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка бронирований."""
    client_name = serializers.CharField(source='client.name', read_only=True)
    client_phone = serializers.CharField(source='client.phone', read_only=True)
    table_info = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = ['id', 'client', 'client_name', 'client_phone', 'table', 'table_info',
                  'date', 'time', 'guests_count', 'status', 'created_at']

    def get_table_info(self, obj):
        return f"Столик #{obj.table.id} ({obj.table.seats} мест)"


class ReservationCreateSerializer(serializers.Serializer):
    """
    Сериализатор создания бронирования.
    Принимает данные клиента и параметры брони.
    Бизнес-логика: автовыбор столика по количеству гостей.
    """
    # Данные клиента
    name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField()

    # Параметры брони
    date = serializers.DateField()
    time = serializers.TimeField()
    guests_count = serializers.IntegerField(min_value=1, default=1)
    location = serializers.ChoiceField(
        choices=[('hall', 'Зал'), ('terrace', 'Терраса')],
        required=False,
        allow_blank=True
    )

    def validate(self, attrs):
        """Проверки: прошедшая дата, рабочее время, свободный столик."""
        from .services import find_available_table

        today = date.today()
        if attrs['date'] < today:
            raise serializers.ValidationError(
                'Нельзя забронировать столик на прошедшую дату.'
            )
        now = timezone.now()
        slot_dt = datetime.combine(attrs['date'], attrs['time'])
        if timezone.is_aware(now):
            slot_dt = timezone.make_aware(slot_dt)
        if slot_dt <= now:
            raise serializers.ValidationError(
                'Нельзя забронировать столик на прошедшее время.'
            )

        # weekday(): 0=пн, 6=вс. 5,6 — сб, вс
        is_weekend = attrs['date'].weekday() >= 5
        start_time, end_time = WORKING_HOURS_WEEKEND if is_weekend else WORKING_HOURS_WEEKDAY

        if not (start_time <= attrs['time'] <= end_time):
            raise serializers.ValidationError(
                f'Неверное время. '
                f'Пн–Пт: 8:00–22:00, Сб–Вс: 9:00–23:00.'
            )

        table = find_available_table(
            date=attrs['date'],
            time=attrs['time'],
            guests_count=attrs['guests_count'],
            location=attrs.get('location') or None
        )

        if not table:
            raise serializers.ValidationError(
                'Нет свободных столиков на выбранную дату и время. '
                'Попробуйте другое время или дату.'
            )

        attrs['_table'] = table
        return attrs

    def create(self, validated_data):
        """Создаём клиента и бронирование."""
        table = validated_data.pop('_table')

        client = Client.objects.create(
            name=validated_data['name'],
            phone=validated_data['phone'],
            email=validated_data['email']
        )

        reservation = Reservation.objects.create(
            client=client,
            table=table,
            date=validated_data['date'],
            time=validated_data['time'],
            guests_count=validated_data['guests_count'],
            status='pending'
        )

        return reservation
