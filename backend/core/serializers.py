from rest_framework import serializers
from .models import Asset, Item, ProductionOrder, DowntimeReason, DowntimeEvent

class ModelCleanSerializerMixin:
    def validate(self, attrs):
        # Let field-level DRF validation run first, then model-level validation.
        # We validate against an instance to include existing values on partial updates.
        instance = getattr(self, "instance", None)

        if instance is None:
            instance = self.Meta.model(**attrs)
        else:
            for k, v in attrs.items():
                setattr(instance, k, v)

        # Exclude auto fields; full_clean will still run clean() and field validation.
        instance.full_clean()
        return attrs


class AssetSerializer(ModelCleanSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = [
            "id",
            "name",
            "is_active",
            "created_at",
            "parent",
            "asset_type",
            "can_run_production",
            "can_record_downtime",
        ]
        read_only_fields = ["id", "created_at"]


class ItemSerializer(ModelCleanSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "sku", "description"]
        read_only_fields = ["id"]


class ProductionOrderSerializer(ModelCleanSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = ProductionOrder
        fields = [
            "id",
            "order_number",
            "item",
            "asset",
            "planned_qty",
            "completed_qty",
            "status",
            "started_at",
            "ended_at",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class DowntimeReasonSerializer(ModelCleanSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = DowntimeReason
        fields = ["id", "code", "description"]
        read_only_fields = ["id"]


class DowntimeEventSerializer(ModelCleanSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = DowntimeEvent
        fields = [
            "id",
            "asset",
            "production_order",
            "reason",
            "start_ts",
            "end_ts",
            "comment",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
