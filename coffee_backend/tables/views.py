"""
ViewSets для API столиков.
"""
from rest_framework import viewsets
from .models import Table
from .serializers import TableSerializer


class TableViewSet(viewsets.ModelViewSet):
    """CRUD для столиков."""
    queryset = Table.objects.all()
    serializer_class = TableSerializer
