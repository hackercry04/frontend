from django.urls import path
from . import views

urlpatterns = [
    path("categories/all/", views.get_categories),
    path("product/all/", views.fetch_all_products),
    path("product/get/<int:id>/", views.get_product_with_id),
    path("productall/", views.get_all_products_to_filter),
    path("profile/details/", views.get_user_with_id),
    path("profile/submit/details/", views.submit_user_profile),
    path("profile/add/address/", views.add_address),
    path("profile/get/address/", views.get_address),
    path("profile/delete/address/", views.delete_address),
    path("profile/update/address/", views.edit_address),
    path("add/cart/", views.add_to_cart),
    path("get/cart/", views.get_cart),
    path("cart/remove/", views.delete_cart_item),
    path("update/cart/", views.update_cart),
    path("placeorder/", views.place_order),
    path("orders/", views.get_order_information_user),
    path("remove/order/", views.cancel_order),
    path("order/checkout/", views.get_data_for_single_product_chekout),
    path("get/cart/item/count/", views.get_cart_item),
    path("return/order/", views.return_order),
]
