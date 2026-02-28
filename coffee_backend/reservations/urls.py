from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ReservationViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
