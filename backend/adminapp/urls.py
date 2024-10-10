from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from adminapp.customjwt import CustomTokenObtainPairView


urlpatterns = [
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("get_categories/", views.get_categories),
    path("addnewcategory/", views.addnewcategory),
    path("delete_category/<int:id>/", views.delete_category),
    path("edit_category/<int:id>/", views.edit_category),
    path("add/", views.add_product),
    path("edit_product/", views.edit_product),
    path("getproduct/id/<int:id>/", views.get_product_with_id),
    path("getproduct/all/", views.getallproduct),
    path("getallusers/", views.getallusers),
    path("updatestatus/", views.editstatus),
    path("product/delete/<int:id>/", views.delete_product_with_id),
    path("orders/", views.get_all_orders),
    path("orders/<int:id>/status/", views.update_status),
    path("orders/<int:id>/", views.get_all_order_details),
]
