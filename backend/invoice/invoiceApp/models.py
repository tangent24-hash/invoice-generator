from django.db import models
import uuid


# Create your models here.
class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    invoice_number = models.CharField(verbose_name="Invoice Number", max_length=64)
    company_details = models.TextField(verbose_name="Company Details", max_length=400)
    bill_to = models.TextField(verbose_name="Bill to", max_length=400)
    company_logo = models.ImageField(upload_to="images")
    discount = models.FloatField(default=0, verbose_name="Discount($)")
    tax = models.FloatField(default=0, verbose_name="Tax % ")
    shipping_fee = models.FloatField(default=0, verbose_name="Shipping Fee")
    notes = models.TextField(max_length=300)
    invoice_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()


class Item(models.Model):
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(verbose_name="Item Description", max_length=256)
    unit_cost = models.FloatField(default=0, max_length=100)
    quantity = models.FloatField(default=0, max_length=16)
    total = models.FloatField(default=0, max_length=64, blank=True, null=True)


