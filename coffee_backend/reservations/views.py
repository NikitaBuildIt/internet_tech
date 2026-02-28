"""
ViewSets для API бронирований.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Client, Reservation
from .serializers import (
    ClientSerializer,
    ReservationListSerializer,
    ReservationCreateSerializer,
)


class ClientViewSet(viewsets.ModelViewSet):
    """CRUD для клиентов."""
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    """CRUD для бронирований."""
    queryset = Reservation.objects.select_related('client', 'table').all()
    serializer_class = ReservationListSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return ReservationCreateSerializer
        return ReservationListSerializer

    def create(self, request, *args, **kwargs):
        """Создание бронирования с автовыбором столика."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reservation = serializer.save()
        return Response(
            ReservationListSerializer(reservation).data,
            status=status.HTTP_201_CREATED
        )
