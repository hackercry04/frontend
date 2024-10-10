from django.urls import path
from . import views

urlpatterns = [
    path("add/coupon/", views.add_coupon),
    path("get/coupons/", views.get_coupons),
    path("delete/coupons/<int:id>/", views.remove_coupon),
    path("return-cancel-request/<int:id>/", views.manage_status_request),
    path("generate/report/", views.generate_report_with_date_range),
]
