"""
ViewSets для API меню.
"""
from rest_framework import viewsets
from rest_framework.decorators import action

from .models import MenuCategory, MenuItem
from .serializers import (
    MenuCategorySerializer,
    MenuItemSerializer,
    MenuItemCreateUpdateSerializer,
)


class MenuCategoryViewSet(viewsets.ModelViewSet):
    """CRUD для категорий меню."""
    queryset = MenuCategory.objects.all()
    serializer_class = MenuCategorySerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    """CRUD для позиций меню."""
    queryset = MenuItem.objects.select_related('category').all()
    serializer_class = MenuItemSerializer

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MenuItemCreateUpdateSerializer
        return MenuItemSerializer

    def get_queryset(self):
        """Фильтр по категории через query param ?category=id"""
        qs = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs


class PublicMenuViewSet(viewsets.ReadOnlyModelViewSet):
    """Публичный API - только просмотр меню."""
    queryset = MenuItem.objects.select_related('category').filter(is_available=True)
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs
