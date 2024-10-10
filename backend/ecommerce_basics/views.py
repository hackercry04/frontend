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
    Wallet,
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


# Create your views here.
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @user_required
def get_categories(request):
    categories = list(Category.objects.values("category_id", "name", "listed"))
    return JsonResponse({"categories": categories}, safe=False)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@user_required
def fetch_all_products(request):
    # Annotate with aggregated images and variants
    l = []

    p = list(
        Product.objects.filter(is_active=True).values(
            "product_id",
            "name",
            "price",
            "description",
            "category__name",
            "offer_price",
            "quantity",
        )
    )

    img = list(
        ProductImage.objects.filter(product_id__is_active=True).values(
            "image", "product_id"
        )
    )
    print(len(img))
    for i in range(len(p)):

        p[i]["img"] = img[0 + (i * 3) : 3 + (i * 3)]

    return JsonResponse(
        {
            "products": p,
        },
        safe=False,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@user_required
def get_product_with_id(request, id):
    p = list(
        Product.objects.filter(product_id=id).values(
            "name", "price", "description", "category", "offer_price", "quantity"
        )
    )

    img = list(ProductImage.objects.filter(product_id=id).values("image"))
    varient = list(
        ProductVariant.objects.filter(product_id=id).values(
            "id", "name", "image", "price", "quantity", "offer_price"
        )
    )
    return JsonResponse(
        {"products": p, "product_image": img, "varients": varient}, safe=False
    )


def get_all_products_to_filter(request):
    # Annotate with aggregated images and variants
    l = []

    p = list(
        Product.objects.filter(is_active=True).values(
            "product_id",
            "name",
            "price",
            "description",
            "category__name",
            "offer_price",
            "quantity",
            "created_date",
            "rating",
        )
    )

    img = list(
        ProductImage.objects.filter(product_id__is_active=True).values(
            "image", "product_id"
        )
    )
    print(len(img))
    for i in range(len(p)):

        p[i]["img"] = img[0 + (i * 3) : 3 + (i * 3)]

    return JsonResponse(
        {
            "products": p,
        },
        safe=False,
    )


@api_view(["GET"])
def get_user_with_id(request):
    user = list(
        User.objects.filter(id=request.user.id).values(
            "id",
            "first_name",
            "last_name",
            "email",
            "location",
            "state",
            "country",
            "pin",
            "dob",
            "phone",
        )
    )

    return JsonResponse({"User": user})


@api_view(["POST"])
def submit_user_profile(request):
    print(request.user.id)
    user = User.objects.get(id=request.user.id)

    data = json.loads(request.body)
    user.first_name = data.get("first_name")
    user.last_name = data.get("last_name")
    user.email = data.get("email")
    user.location = data.get("location")
    user.state = data.get("state")
    user.country = data.get("country")
    user.pin = data.get("pin")
    user.dob = data.get("dob")
    user.phone = data.get("phone")
    user.save()
    return HttpResponse("update successfull")


@api_view(["POST"])
def add_address(request):
    data = json.loads(request.body)
    a = Address.objects.create(
        apartment_address=data.get("apartmentAddress"),
        street_address=data.get("streetAddress"),
        city=data.get("city"),
        district=data.get("district"),
        state=data.get("state"),
        country=data.get("country"),
        postal_code=data.get("postalCode"),
        phone_number=data.get("phoneNumber"),
        user_id=request.user.id,
        title=data.get("title"),
    )

    a.save()
    return JsonResponse({"id": a.id})


@api_view(["GET"])
def get_address(request):
    address = list(
        Address.objects.filter(user_id=request.user.id, is_active=True).values(
            "id",
            "title",
            "apartment_address",
            "street_address",
            "city",
            "district",
            "state",
            "country",
            "postal_code",
            "phone_number",
        )
    )

    return JsonResponse({"adress": address})


@api_view(["DELETE"])
def delete_address(request):
    data = json.loads(request.body)
    address = Address.objects.get(id=data["id"])
    address.is_active = False
    address.save()
    return HttpResponse("address deletion success")


@api_view(["PUT"])
def edit_address(request):
    data = json.loads(request.body)

    try:
        address = Address.objects.get(id=data["id"], user_id=request.user.id)

        address.apartment_address = data.get(
            "apartmentAddress", address.apartment_address
        )
        address.street_address = data.get("streetAddress", address.street_address)
        address.city = data.get("city", address.city)
        address.district = data.get("district", address.district)
        address.state = data.get("state", address.state)
        address.country = data.get("country", address.country)
        address.postal_code = data.get("postalCode", address.postal_code)
        address.phone_number = data.get("phoneNumber", address.phone_number)
        address.title = data.get("title", address.title)

        address.save()

        return JsonResponse(
            {"id": address.id, "message": "Address updated successfully"}
        )

    except Address.DoesNotExist:
        return JsonResponse({"error": "Address not found"}, status=404)


@api_view(["POST"])
def add_to_cart(request):
    data = json.loads(request.body)
    product_id = data.get("product_id")
    varient_id = data.get("varient_id")
    quantity = data.get("quantity")
    if quantity < 250:
        return HttpResponse("qunatity is less than 250g", status=500)
    img = data.get("img")
    try:
        cart = Cart.objects.get(user_id=request.user.id)
    except Cart.DoesNotExist:
        cart = Cart.objects.create(user_id=request.user.id)
        c = CartItem.objects.create(
            quantity=quantity,
            cart_id=cart.id,
            product_id=product_id,
            variant_id=varient_id,
            img=img,
        )
        c.save()
        return HttpResponse("item added to cart")

    print(cart.id, "fsdfadf")
    try:
        cartitem = CartItem.objects.get(product_id=product_id)
    except CartItem.DoesNotExist:
        CartItem.objects.create(
            quantity=quantity,
            cart_id=cart.id,
            product_id=product_id,
            variant_id=varient_id,
            img=img,
        )
        return HttpResponse("item added to cart")

    if cartitem.product_id != product_id or cartitem.variant_id != varient_id:
        cartitem.quantity = quantity
        cartitem.cart_id = cart.id
        cartitem.product_id = product_id
        cartitem.variant_id = varient_id
        cartitem.img = img
        cartitem.save()
        return HttpResponse("item added to cart")

    return HttpResponse("something went wrong ", status=500)


@api_view(["GET"])
def get_cart(request):
    cart = Cart.objects.get(user_id=request.user.id)
    cart_items = list(
        CartItem.objects.filter(cart_id=cart.id)
        .prefetch_related("product__images")
        .values(
            "cart_id",
            "quantity",
            "product_id",
            "img",
            "product__name",
            "product__price",
            "product__offer_price",
            "product__category",
            "variant_id__name",
            "variant_id__image",
            "variant_id__quantity",
            "variant_id__price",
            "product__quantity",
            "variant__offer_price",
            "variant_id",
        )
    )

    return JsonResponse({"data": cart_items})


@api_view(["POST"])
def delete_cart_item(request):
    data = json.loads(request.body)
    data = data["item"]
    cart_id = data["cart_id"]
    product_id = data["product_id"]
    CartItem.objects.filter(cart_id=cart_id, product_id=product_id).delete()
    return HttpResponse("item delete successfull")


def update_cart(request):
    data = json.loads(request.body)
    data = data["item"]
    cart_id = data["cart_id"]
    product_id = data["product_id"]
    quantity = data["quantity"]
    variant_id__quantity = data["variant_id__quantity"]

    i = CartItem.objects.get(product_id=product_id)

    i.quantity = quantity
    i.save()
    return HttpResponse("main product quantity updated")


@api_view(["POST"])
def place_order(request):
    if request.method == "POST":
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
                    couponusecount = couponusecount + 1

                    couponprice = (float(quantity) / 250 * float(price)) * (
                        coupon.discountValue / 100
                    )

            # print('this iss debugging',(coupon.selectedCategory_id,category_id,coupon.selectedProduct,product_id , coupon.discountSection ))
            tottal = 0

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
                    True if (paymenttype == "upi" or paymenttype == "wallet") else False
                ),
            )
            tottal = tottal + (float(quantity) / 250 * float(price)) - couponprice
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

                ##logiv for wallet deduction when paid with wallet
            if paymenttype == "wallet":
                print("tottal price is ", tottal)
                balance = Wallet.objects.create(
                    user_id=request.user.id, amount=-1 * tottal
                )
                balance.save()
                balance.refresh_from_db()

        return JsonResponse(
            {"status": "success", "order_id": order.order_id}, status=201
        )
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(["GET"])
def get_order_information_user(request):
    # Filter orders placed by the user with id 5
    orders = list(Order.objects.filter(user_id=request.user.id).values("order_id"))
    products = list(
        OrderItem.objects.filter(user_id=request.user.id).values(
            "id",
            "created_at",
            "quantity",
            "product_id",
            "variant_id",
            "img",
            "status",
            "variant_id__name",
            "product_id__name",
            "price",
            "order_id__address_id__street_address",
            "order_id__address_id__apartment_address",
            "order_id__address_id__city",
            "order_id__address_id__state",
            "order_id__address_id__country",
            "order_id__address_id__postal_code",
            "order_id__address_id__district",
            "order_id__address_id__created_at",
            "total_product_price",
            "quantity",
            "order_id__user_id__first_name",
            "order_id__user_id__last_name",
            "order_id__user_id__email",
            "order_id__user_id__phone",
        )
    )

    # ordered_products=list(OrderItem.objects.filter(order_id=request.user.id))
    # print(ordered_products)
    return JsonResponse({"orders": products})


@api_view(["post"])
def cancel_order(request):
    data = json.loads(request.body)
    order_id = data.get("id")
    reason = data.get("reason")
    item = OrderItem.objects.get(id=order_id)
    print(item.user_id, request.user.id)
    if item.user_id == request.user.id:
        item.status = "Cancel requested"
        item.reason = reason
        item.save()
        return HttpResponse("item cancelled succesfully")
    return HttpResponse("you are not allowed to do this ", status=403)


@api_view(["post"])
def return_order(request):
    data = json.loads(request.body)
    order_id = data.get("id")
    item = OrderItem.objects.get(id=order_id)
    print(item.user_id, request.user.id)
    if item.user_id == request.user.id:
        item.status = "Return requested"
        item.save()
        return HttpResponse("item cancelled succesfully")
    return HttpResponse("you are not allowed to do this ", status=403)


def get_data_for_single_product_chekout(request):

    data = json.loads(request.body)

    product = Product.objects.get(product_id=data.get("product_id"))

    variant_id = data.get("variant_id")

    vproduct = None
    if variant_id != "null":
        vproduct = ProductVariant.objects.get(id=variant_id)

    quantity = data.get("q")

    image = list(
        ProductImage.objects.filter(product_id=data.get("product_id")).values("image")
    )
    product_image = image[0]["image"] if image else None

    response_data = {
        "quantity": quantity,
        "product_id": data.get("product_id"),
        "img": product_image,
        "product__name": product.name,
        "product__price": product.price,
        "product__offer_price": product.offer_price,
        "product__category": product.category_id,
        "product__quantity": product.quantity,
    }

    if vproduct:
        response_data.update(
            {
                "variant_id__name": vproduct.name,
                "variant_id__image": vproduct.image.url[7:],
                "variant_id__quantity": vproduct.quantity,
                "variant_id__price": vproduct.price,
                "variant__offer_price": vproduct.offer_price,
                "variant_id": vproduct.id,
            }
        )
    else:
        response_data.update(
            {
                "variant_id__name": None,
                "variant_id__image": None,
                "variant_id__quantity": None,
                "variant_id__price": None,
                "variant__offer_price": None,
                "variant_id": None,
            }
        )

    return JsonResponse({"data": [response_data]})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@user_required
def get_cart_item(request):
    cart_id = Cart.objects.get(user_id=request.user.id)
    cart_id = cart_id.id
    count = CartItem.objects.filter(cart_id=cart_id).count()
    print(count)
    return JsonResponse({"count": count})
