from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuCategoryViewSet, MenuItemViewSet, PublicMenuViewSet

router = DefaultRouter()
router.register(r'menu_categories', MenuCategoryViewSet)
router.register(r'menu_items', MenuItemViewSet)
router.register(r'menu', PublicMenuViewSet, basename='public-menu')  # Публичный список

urlpatterns = [
    path('', include(router.urls)),
]
