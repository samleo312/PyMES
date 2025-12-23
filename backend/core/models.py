from django.db import models
from django.core.exceptions import ValidationError


from django.db import models
from django.core.exceptions import ValidationError

class Asset(models.Model):
    class AssetType(models.TextChoices):
        GENERIC = "GENERIC", "Generic"
        ENTERPRISE = "ENTEPRISE", "Enterprise"
        BUSINESS_UNIT = "BUSINESS_UNIT", "Business Unit"
        SITE = "SITE", "Site"
        LINE = "LINE", "Line"
        CELL = "CELL", "Cell"
        MACHINE = "MACHINE", "Machine"

    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    parent = models.ForeignKey(
        "self",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="children",
    )

    asset_type = models.CharField(
        max_length=30,
        choices=AssetType.choices,
        default=AssetType.GENERIC,
    )

    can_run_production = models.BooleanField(default=False)
    can_record_downtime = models.BooleanField(default=False)

    def clean(self):
        if self.parent_id and self.parent_id == self.pk:
            raise ValidationError({"parent": "An asset cannot be its own parent."})

        p = self.parent
        while p is not None:
            if p.pk == self.pk:
                raise ValidationError({"parent": "Cyclic hierarchy detected."})
            p = p.parent

        if self.can_run_production and not self.can_record_downtime:
            raise ValidationError(
                {"can_record_downtime": "Assets that run production should usually be able to record downtime."}
            )

    def __str__(self):
        return self.name


class Item(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.sku


class ProductionOrder(models.Model):
    class Status(models.TextChoices):
        PLANNED = "PLANNED"
        RUNNING = "RUNNING"
        PAUSED = "PAUSED"
        COMPLETE = "COMPLETE"
        CANCELLED = "CANCELLED"

    order_number = models.CharField(max_length=50, unique=True)
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name="orders")

    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name="orders",
        null=True,
        blank=True,
    )

    

    planned_qty = models.PositiveIntegerField(default=0)
    completed_qty = models.PositiveIntegerField(default=0)

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PLANNED)

    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # An asset must have at most one running production order at a time.
        if self.status == self.Status.RUNNING and self.asset_id is not None:
            qs = ProductionOrder.objects.filter(asset_id=self.asset_id, status=self.Status.RUNNING)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError("This asset already has a RUNNING production order.")

    def __str__(self):
        return self.order_number


class DowntimeReason(models.Model):
    code = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.code


class DowntimeEvent(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT, related_name="downtime_events")
    production_order = models.ForeignKey(
        ProductionOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="downtime_events",
    )
    reason = models.ForeignKey(DowntimeReason, on_delete=models.PROTECT, related_name="events")

    start_ts = models.DateTimeField()
    end_ts = models.DateTimeField(null=True, blank=True)

    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.end_ts and self.end_ts <= self.start_ts:
            raise ValidationError("end_ts must be after start_ts")

    def __str__(self):
        return f"{self.asset} downtime ({self.reason})"
