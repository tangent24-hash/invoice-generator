from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Invoice, Item
from .serializers import InvoiceSerializer, ItemSerializer
from django.http import HttpResponse
from django.template.loader import get_template
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from xhtml2pdf import pisa
from django.views.decorators.csrf import csrf_exempt


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    parser_classes = [MultiPartParser, FormParser]


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        unit_cost = serializer.validated_data['unit_cost']
        quantity = serializer.validated_data['quantity']
        total = unit_cost * quantity
        serializer.save(total=total)



class GeneratePDFView(APIView):
    @method_decorator(csrf_exempt)  # Exempt from CSRF protection if needed
    def get(self, request, *args, **kwargs):
        invoice_id = self.request.query_params.get('invoice_id')
        invoice_instance = Invoice.objects.get(id=invoice_id)
        items = Item.objects.filter(invoice_id=invoice_id)

        subtotal = 0.00
        for item in items:
            subtotal += float(item.quantity) * item.unit_cost

        total_after_discount = subtotal - invoice_instance.discount

        total_after_tax = total_after_discount + ((total_after_discount * invoice_instance.tax) / 100.00)

        tax_value = (total_after_discount * invoice_instance.tax) / 100.00
        total = invoice_instance.shipping_fee + total_after_tax

        context = {
            # Add your data to be rendered in the PDF here
            "invoice_number": invoice_instance.invoice_number,
            "company_details": invoice_instance.company_details,
            "bill_to": invoice_instance.bill_to,
            "company_logo": invoice_instance.company_logo,
            "discount": invoice_instance.discount,
            "tax": invoice_instance.tax,
            "shipping_fee": invoice_instance.shipping_fee,
            "notes": invoice_instance.notes,
            "invoice_date": invoice_instance.invoice_date,
            "due_date": invoice_instance.due_date,
            "items": items,
            "grand_total": total,
            "subtotal": subtotal,
            "total_after_tax": total_after_tax,
            "total_after_discount": total_after_discount,
            "tax_value": tax_value,
        }
        html_content = get_template('pdf_template.html').render(context=context)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="your_pdf_filename.pdf"'

        pisa_status = pisa.CreatePDF(
            html_content, dest=response, encoding='utf-8'
        )
        if pisa_status.err:
            return Response({'error': pisa_status.err}, status=500)
        return response
