from django.urls import path
from . import views

urlpatterns = [
    path("addto/wishlist/", views.addtowishlist),
    path("get/wishlist/", views.get_all_wishlist),
    path("delete/wishlist/item/<int:id>/", views.remove_wishlist),
    path("check/coupon/", views.get_coupon),
    path("get/wallet/", views.get_wallet),
    path("get_latest_items/", views.get_latest_arrivals),
]
