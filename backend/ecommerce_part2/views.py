from django.shortcuts import render
from userapp.models import (
    Category,
    Product,
    Coupon,
    ProductVariant,
    User,
    Address,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Wishlist,
    Wallet,
    Walletamount,
    ProductImage,
)
import json
from django.db.models import F
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from project1_backend.jwtauthdecorator import user_required
from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponse
from django.db.models import Subquery, OuterRef, Prefetch, Sum
from django.conf import settings
import decimal
from django.db.models.functions import Coalesce


@api_view(["POST"])
def addtowishlist(request):
    data = json.loads(request.body)
    product_id = data.get("product_id")
    varient_id = data.get("product_varient_id")
    imageurl = data.get("imageurl")
    product_exists = Wishlist.objects.filter(product_id=product_id).exists()
    varient_exists = Wishlist.objects.filter(variant_id=varient_id).exists()
    if product_exists and not varient_exists:
        w = Wishlist.objects.create(
            user_id=request.user.id,
            product_id=product_id,
            variant_id=varient_id,
            imageurl=imageurl,
        )
        w.save()
        return HttpResponse("wishlist created succesfully ")
    elif not product_exists:
        w = Wishlist.objects.create(
            user_id=request.user.id,
            product_id=product_id,
            variant_id=varient_id,
            imageurl=imageurl,
        )
        w.save()
        return HttpResponse("wishlist created succesfully ")
    return HttpResponse("already in wishlist")


@api_view(["get"])
def get_all_wishlist(request):
    wishlist = Wishlist.objects.filter(user_id=request.user.id).values(
        "id",
        "product_id",
        "variant_id",
        "product_id__name",
        "product_id__price",
        "variant_id__name",
        "variant_id__price",
        "variant_id__image",
        "imageurl",
        quantity=Coalesce(
            "variant_id__quantity", "product_id__quantity"
        ),  # Return variant quantity if exists, else product quantity
    )

    return JsonResponse({"wishlist": list(wishlist)})


@api_view(["delete"])
def remove_wishlist(request, id):
    Wishlist.objects.get(id=id, user_id=request.user.id).delete()
    return HttpResponse("success")


@api_view(["POST"])
def get_coupon(request):
    try:
        data = json.loads(request.body)
        code = data.get("code")

        # Fetch the coupons
        coupons = list(Coupon.objects.filter(code=code).values())
        if coupons == []:
            return HttpResponse("no coupon  found", status=404)

        return JsonResponse({"coupons": coupons})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["GET"])
def get_wallet(request):
    user_id = request.user.id

    # Get wallet details
    wallets = list(
        Wallet.objects.filter(user_id=user_id).values(
            "id",
            "amount",
            "orderitem_id",
            "orderitem_id__product_id__name",
            "created_at",
        )
    )
    print(wallets)

    # Calculate total amount as a Decimal
    total = Wallet.objects.filter(user_id=user_id).aggregate(total=Sum("amount"))[
        "total"
    ] or decimal.Decimal("0.00")

    # Create or update the Walletamount for the user
    # Walletamount.objects.update_or_create(
    #     user_id=user_id,
    #     defaults={'balance': total}
    # )

    return JsonResponse({"wallet": wallets, "total": int(total)})


def get_latest_arrivals(request):
    # Get the latest 4 products
    products = list(
        Product.objects.order_by("-product_id").values(
            "product_id", "name", "price", "offer_price"
        )[:4]
    )

    # Get all images ordered by id (latest first)
    images = {
        image["product_id"]: image["image"]
        for image in ProductImage.objects.order_by("-id").values("product_id", "image")
    }

    # Combine products with their corresponding images
    latest_arrivals = []
    for product in products:
        product_id = product["product_id"]
        product["image"] = images.get(
            product_id, None
        )  # Get image for the product or None if not found
        latest_arrivals.append(product)

    return JsonResponse({"latest": latest_arrivals})
