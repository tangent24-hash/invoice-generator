from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, ItemViewSet, GeneratePDFView
from django.urls import path

router = DefaultRouter()

router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'items', ItemViewSet, basename='items')

urlpatterns = [
                  path('generate-pdf/', GeneratePDFView.as_view(), name='generate_pdf'),

              ] + router.urls
