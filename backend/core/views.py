from rest_framework import viewsets
from .models import Asset, Item, ProductionOrder, DowntimeReason, DowntimeEvent
from .serializers import (
    AssetSerializer,
    ItemSerializer,
    ProductionOrderSerializer,
    DowntimeReasonSerializer,
    DowntimeEventSerializer,
)

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by("id")
    serializer_class = AssetSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by("id")
    serializer_class = ItemSerializer


class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all().order_by("id")
    serializer_class = ProductionOrderSerializer


class DowntimeReasonViewSet(viewsets.ModelViewSet):
    queryset = DowntimeReason.objects.all().order_by("id")
    serializer_class = DowntimeReasonSerializer


class DowntimeEventViewSet(viewsets.ModelViewSet):
    queryset = DowntimeEvent.objects.all().order_by("id")
    serializer_class = DowntimeEventSerializer
