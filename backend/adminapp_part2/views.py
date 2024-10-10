from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from userapp.models import (
    Category,
    Product,
    ProductImage,
    ProductVariant,
    User,
    Order,
    OrderItem,
    Coupon,
    Wallet,
)
from django.db.models import Sum, F, Count
from django.core.serializers import serialize
from project1_backend.jwtauthdecorator import admin_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models.functions import TruncDate
import json
from rest_framework import status
from decimal import Decimal


@api_view(["post"])
def add_coupon(request):

    data = json.loads(request.body)
    code = data.get("couponCode")
    discount_type = data.get("discountType")
    discount_value = int(
        data.get("discountValue", 0)
    )  # Ensure discountValue is an integer
    expiry_date = data.get("expiryDate")
    selected_category = data.get("selectedCategory", None)  # Handle null values
    selected_product = data.get("selectedProduct", None)  # Handle null values
    description = data.get("description", "")

    # Create and save the new Coupon object
    coupon = Coupon.objects.create(
        code=code,
        discountType=discount_type,
        discountValue=int(discount_value),
        expiryDate=expiry_date,
        selectedCategory=(
            Category.objects.get(category_id=selected_category["category_id"])
            if selected_category
            else None
        ),
        selectedProduct=(
            Product.objects.get(product_id=selected_product["product_id"])
            if selected_product
            else None
        ),
        discountSection=data.get("couponType"),
        description=description,
    )

    # Return a success response
    return JsonResponse({"message": "Coupon created successfully!"}, status=201)


# except Exception as e:
#     return JsonResponse({'error': str(e)}, status=400)


def get_coupons(request):
    c = list(
        Coupon.objects.values(
            "coupon_id",
            "code",
            "discountType",
            "discountValue",
            "expiryDate",
            "selectedCategory_id__name",
            "selectedProduct_id__name",
            "use_count",
            "discountSection",
            "valid",
        )
    )

    return JsonResponse({"coupons": c})


def remove_coupon(request, id):
    c = Coupon.objects.get(coupon_id=id)
    c.valid = False
    c.save()
    return HttpResponse("success ", status=204)


def manage_status_request(request, id):
    data = json.loads(request.body)
    action = data.get("action")
    status = data.get("status")
    print(action, status, id)
    item = OrderItem.objects.get(id=id)

    if action == "approve" and status == "Return requested":
        item.status = "Return Approved"
        Wallet.objects.create(
            orderitem_id=id, amount=item.total_product_price, user_id=item.user_id
        )
        print("this works", item)
    elif action == "reject" and status == "Return requested":
        item.status = "Return Rejected"
    elif action == "approve" and status == "Cancel requested":
        if item.is_payed:
            Wallet.objects.create(
                orderitem_id=id, amount=item.total_product_price, user_id=item.user_id
            )
        item.status = "Cancel Approved"
    elif action == "reject" and status == "Cancel requested":
        item.status = "Cancel Rejected"

    item.save()

    return HttpResponse("success")


def generate_report_with_date_range(request):
    data = json.loads(request.body)
    start = data.get("startDate")
    end = data.get("endDate")
    total_sales = OrderItem.objects.filter(created_at__range=(start, end)).count()
    total_paid_sales = OrderItem.objects.filter(
        created_at__range=(start, end), is_payed=True
    ).count()
    total_sale_amount = OrderItem.objects.filter(
        created_at__range=(start, end)
    ).aggregate(total=Sum("total_product_price"))
    total_confirmed_sale_amount = OrderItem.objects.filter(
        created_at__range=(start, end), is_payed=True
    ).aggregate(total=Sum("total_product_price"))
    total_discount = OrderItem.objects.filter(
        created_at__range=(start, end), is_payed=True
    ).aggregate(total=Sum(F("price") - F("total_product_price")))
    total_s = list(OrderItem.objects.values("created_at"))
    sales_per_date = list(
        OrderItem.objects.annotate(date=TruncDate("created_at"))  # Group by date
        .values("date")  # Only retrieve the date
        .annotate(sales=Count("id"))  # Count sales per date
        .order_by("date")  # Optionally, order by date
    )

    data = {
        "total_sales": total_sales,
        "total_paid_sales": total_paid_sales,
        "total_sale_amount": total_sale_amount["total"],
        "total_confirmed_sale_amount": total_confirmed_sale_amount["total"],
        "total_discount": total_discount["total"],
    }
    top_10_products = list(
        OrderItem.objects.annotate(
            name=F("product_id__name")  # Alias product ID as idfsdf
        )
        .values("name")
        .annotate(count=Count("product_id"))
    )
    top_10_categories = list(
        OrderItem.objects.annotate(name=F("product_id__category_id__name"))
        .values("name")
        .annotate(count=Count("product_id__category_id"))
    )

    return JsonResponse(
        {
            "data": data,
            "total_sale_date": sales_per_date,
            "top_products": top_10_products,
            "top_categories": top_10_categories,
        }
    )
