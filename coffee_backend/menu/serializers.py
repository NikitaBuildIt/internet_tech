"""
Сериализаторы для меню.
"""
from rest_framework import serializers
from .models import MenuCategory, MenuItem


class MenuCategorySerializer(serializers.ModelSerializer):
    """Сериализатор категории меню."""
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'item_count']

    def get_item_count(self, obj):
        return obj.items.filter(is_available=True).count()


class MenuItemSerializer(serializers.ModelSerializer):
    """Сериализатор позиции меню."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'image', 'category', 'category_name', 'is_available']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback для консоли/тестов
            return obj.image.url
        return None


class MenuItemCreateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания/обновления позиции меню."""
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'image', 'category', 'is_available']
