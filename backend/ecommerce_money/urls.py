from django.urls import path
from . import views

urlpatterns = [
    path("new_order/", views.create_order),
    path("verify_payment", views.verify_payment),
]
