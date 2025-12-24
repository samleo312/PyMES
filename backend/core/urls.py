from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssetViewSet,
    ItemViewSet,
    ProductionOrderViewSet,
    DowntimeReasonViewSet,
    DowntimeEventViewSet,
)

router = DefaultRouter()
router.register(r"assets", AssetViewSet)
router.register(r"items", ItemViewSet)
router.register(r"production-orders", ProductionOrderViewSet)
router.register(r"downtime-reasons", DowntimeReasonViewSet)
router.register(r"downtime-events", DowntimeEventViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
]
