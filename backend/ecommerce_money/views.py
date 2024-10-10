from django.shortcuts import render
from userapp.models import (
    Category,
    Product,
    ProductImage,
    ProductVariant,
    User,
    Address,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Coupon,
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
from django.db.models import Subquery, OuterRef, Prefetch
from django.conf import settings
import razorpay

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# Create your views here.
def create_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        amount = (
            float(data.get("amount")) * 100
        )  # Razorpay amount is in paise, multiply by 100
        currency = "INR"
        print(amount)

        # Create an order in Razorpay
        razorpay_order = razorpay_client.order.create(
            dict(amount=amount, currency=currency, payment_capture="1")
        )

        # Send the order details back to the frontend
        return JsonResponse(
            {
                "razorpay_order_id": razorpay_order["id"],
                "amount": amount,
                "currency": currency,
                "key": settings.RAZORPAY_KEY_ID,
            }
        )


@api_view(["POST"])
def verify_payment(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Razorpay credentials
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        # Extract payment details from the request
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        # Verify the payment signature
        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )

            data = json.loads(request.body)
            address_id = data.get("address_id")
            products_data = data.get("products")
            coupon = data.get("coupon", None)
            paymenttype = data.get("paymenttype")
            couponname = coupon
            if coupon:
                coupon = Coupon.objects.get(code=coupon)
            couponprice = 0

            order = Order(
                user_id=request.user.id,
                address_id=address_id,
            )
            order.save()
            couponusecount = 0
            print("this is working while doing payment")
            for product_data in products_data:
                product_id = product_data.get("product_id")
                quantity = product_data.get("quantity", 1)
                variant_id = product_data.get("variant_id", None)
                image = product_data.get("img")
                price = product_data.get("product__offer_price")
                category_id = product_data.get("product__category")

                # --------------------------------------------------------------------------
                if coupon and (
                    coupon.selectedCategory_id == category_id
                    or coupon.selectedProduct == product_id
                    or coupon.discountSection == "store"
                ):
                    if coupon.discountType == "fixed":
                        couponprice = coupon.discountValue
                        couponusecount = couponusecount + 1
                    elif coupon.discountType == "percentage":
                        couponprice = (float(quantity) / 250 * float(price)) * (
                            coupon.discountValue / 100
                        )
                        couponusecount = couponusecount + 1

                # print('this iss debugging',(coupon.selectedCategory_id,category_id,coupon.selectedProduct,product_id , coupon.discountSection ))

                # ----------------------------------------------------------------------------
                if product_data.get("variant_id__offer_price"):
                    price = product_data.get("variant_id__offer_price")
                if product_data.get("variant_id__image"):
                    image = product_data.get("variant_id__image")

                product = Product.objects.get(product_id=product_id)
                variant = None
                if variant_id:
                    variant = ProductVariant.objects.get(id=variant_id)
                print("payment type is ", paymenttype)
                order_item = OrderItem(
                    order=order,
                    product=product,
                    variant=variant,
                    quantity=quantity,
                    img=image,
                    price=float(price),
                    user_id=request.user.id,
                    total_product_price=(float(quantity) / 250 * float(price))
                    - couponprice,
                    coupon_id=coupon.coupon_id if coupon else None,
                    paymenttype=paymenttype,
                    is_payed=(
                        True
                        if (paymenttype == "upi" or paymenttype == "wallet")
                        else False
                    ),
                )
                order_item.save()

            if coupon:
                print("yes coupon exist", coupon, couponusecount)

                coupon.use_count = F("use_count") + couponusecount

                coupon.save()

                if variant_id:
                    v = ProductVariant.objects.get(id=variant_id)
                    v.quantity = F("quantity") - quantity
                    v.save()
                else:
                    p = Product.objects.get(product_id=product_id)
                    p.quantity = F("quantity") - quantity
                    p.save()
            return JsonResponse({"success": True, "message": "Payment verified!"})
        except razorpay.errors.SignatureVerificationError:
            return JsonResponse(
                {"success": False, "message": "Payment verification failed!"},
                status=403,
            )
