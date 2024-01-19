from rest_framework import serializers
from .models import Invoice, Item


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'company_details', 'bill_to', 'company_logo', 'discount', 'tax',
                  'shipping_fee', 'notes', 'invoice_date', 'due_date']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['invoice_id', 'description', 'unit_cost', 'quantity', 'total']
