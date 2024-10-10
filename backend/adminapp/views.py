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
)
from django.core.serializers import serialize
from project1_backend.jwtauthdecorator import admin_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.core.exceptions import ValidationError
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status


def test(requests):
    return HttpResponse("test")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@admin_required
def get_categories(request):
    categories = list(Category.objects.values("category_id", "name", "listed"))
    return JsonResponse({"categories": categories}, safe=False)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@admin_required
def addnewcategory(request):
    if request.method == "POST":
        # Extract data from the request
        data = json.loads(request.body)
        name = data.get("name")
        print("name is ", name)
        listed = data.get("listed")

        # Check if the name is provided
        if not name:
            return JsonResponse({"error": "Category name is required."}, status=400)

        # Create and save a new category instance
        try:
            category = Category.objects.create(name=name, listed=listed)
            return JsonResponse({"message": "Category added successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


@api_view(["delete"])
@permission_classes([IsAuthenticated])
@admin_required
def delete_category(request, id):
    c = Category.objects.get(category_id=id)
    c.delete()
    return HttpResponse("success")


@api_view(["put"])
@permission_classes([IsAuthenticated])
@admin_required
def edit_category(request, id):
    c = Category.objects.get(category_id=id)
    data = json.loads(request.body)
    name = data.get("name")
    listed = data.get("listed")
    c.name = name
    c.listed = listed
    c.save()
    return HttpResponse("sucess")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@admin_required
def add_product(request):
    name = request.POST.get("name")
    offerprice = request.POST.get("offerprice")
    price = request.POST.get("price")
    category_id = request.POST.get("category")
    itemweight = request.POST.get("itemweight")
    quantity = request.POST.get("quantity")
    description = request.POST.get("description")

    # Fetch images from the request
    image = request.FILES.get("image1")
    image2 = request.FILES.get("image2")
    image3 = request.FILES.get("image3")
    variantimage1 = request.FILES.get("variant1Image")
    variantimage2 = request.FILES.get("variant2Image")

    varientname1 = request.POST.get("variant1Name")
    varientname2 = request.POST.get("variant2Name")
    varient1quantity = request.POST.get("variant1Quantity")
    varient2quantity = request.POST.get("variant2Quantity")
    varient1price = request.POST.get("variant1Price")
    varient2price = request.POST.get("variant2Price")
    varient1offer = request.POST.get("variant1_offer_Price")
    varient2offer = request.POST.get("variant2_offer_Price")

    # Check if product already exists
    if Product.objects.filter(name=name, category_id=category_id).exists():
        return Response(
            {"error": "Product already exists."}, status=status.HTTP_400_BAD_REQUEST
        )

    # Validate that offer price is less than or equal to main price
    if float(offerprice) > float(price):
        return Response(
            {"error": "Offer price must be less than or equal to main price."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check for the category
    try:
        category = Category.objects.get(category_id=category_id)
    except Category.DoesNotExist:
        return Response(
            {"error": "Category does not exist."}, status=status.HTTP_404_NOT_FOUND
        )

    # Create the product
    p = Product.objects.create(
        name=name,
        offer_price=offerprice,
        price=price,
        category=category,
        quantity=quantity,
        description=description,
    )

    # Create product variants
    ProductVariant.objects.bulk_create(
        [
            ProductVariant(
                name=varientname1,
                image=variantimage1,
                price=varient1price,
                quantity=varient1quantity,
                product=p,
                offer_price=varient1offer,
            ),
            ProductVariant(
                name=varientname2,
                image=variantimage2,
                price=varient2price,
                quantity=varient2quantity,
                product=p,
                offer_price=varient2offer,
            ),
        ]
    )

    # Create product images
    ProductImage.objects.bulk_create(
        [
            ProductImage(image=image, product=p),
            ProductImage(image=image2, product=p),
            ProductImage(image=image3, product=p),
        ]
    )

    p.save()

    return Response(
        {"message": "Product added successfully."}, status=status.HTTP_201_CREATED
    )


@api_view(["get"])
@permission_classes([IsAuthenticated])
@admin_required
def get_product_with_id(request, id):
    p = list(
        Product.objects.filter(product_id=id).values(
            "name", "price", "description", "category", "offer_price", "quantity"
        )
    )

    img = list(ProductImage.objects.filter(product_id=id).values("image"))
    varient = list(
        ProductVariant.objects.filter(product_id=id).values(
            "name", "image", "price", "quantity", "offer_price"
        )
    )
    return JsonResponse(
        {"products": p, "product_image": img, "varients": varient}, safe=False
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@admin_required
def edit_product(request):
    try:
        product_id = request.POST.get("id")
        product = Product.objects.get(product_id=product_id)
    except Product.DoesNotExist:
        return JsonResponse(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )

    # Retrieve and update product fields
    name = request.POST.get("name")
    offerprice = request.POST.get("offerprice")
    price = request.POST.get("price")
    category_id = request.POST.get("category", -1)
    itemweight = request.POST.get("itemweight")
    quantity = request.POST.get("quantity")
    description = request.POST.get("description")
    varient1offer = request.POST.get("variant1_offer_Price")
    varient2offer = request.POST.get("variant2_offer_Price")

    if category_id == "undefined":
        return JsonResponse(
            {"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND
        )
    try:
        category = Category.objects.get(category_id=category_id)
    except Category.DoesNotExist:
        return JsonResponse(
            {"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND
        )

    # Handle file uploads (check if the file key exists in request.FILES)
    image = request.FILES.get("image1") if "image1" in request.FILES else None
    image2 = request.FILES.get("image2") if "image2" in request.FILES else None
    image3 = request.FILES.get("image3") if "image3" in request.FILES else None
    varientimage1 = (
        request.FILES.get("variant1Image") if "variant1Image" in request.FILES else None
    )
    varientimage2 = (
        request.FILES.get("variant2Image") if "variant2Image" in request.FILES else None
    )
    # print(image,image2,image3)
    # if image==None or  image2==None or  image3==None:
    #             return JsonResponse({'error': 'product image not found:you should upload exactly 3 image'}, status=status.HTTP_404_NOT_FOUND)

    # if request.FILES.get('variant1Image')=='undefined' or request.FILES.get('variant2Image')=='undefined':
    #             return JsonResponse({'error': 'varient image missing'}, status=status.HTTP_404_NOT_FOUND)

    varientname1 = request.POST.get("variant1Name")
    varientname2 = request.POST.get("variant2Name")
    varient1quantity = request.POST.get("variant1Quantity")
    varient2quantity = request.POST.get("variant2Quantity")
    varient1price = request.POST.get("variant1Price")
    varient2price = request.POST.get("variant2Price")

    # Update product details
    product.name = name
    product.offer_price = offerprice
    product.price = price
    product.category = category
    product.item_weight = itemweight
    product.quantity = quantity
    product.description = description
    product.save()

    # Update or create product images
    if image:
        # Update or create image1
        ProductImage.objects.update_or_create(
            product=product, defaults={"image": image}
        )

    if image2:
        # Update or create image2
        ProductImage.objects.update_or_create(product=product, image=image2)

    if image3:
        # Update or create image3
        ProductImage.objects.update_or_create(product=product, image=image3)

    # Update or create product variants only if all necessary fields are provided
    if varientname1 and varient1quantity and varient1price:
        if (
            varientimage1 and varientimage1 != "undefined"
        ):  # Check for undefined or missing file
            ProductVariant.objects.update_or_create(
                product=product,
                name=varientname1,
                defaults={
                    "image": varientimage1,
                    "price": varient1price,
                    "quantity": varient1quantity,
                    "offer_price": varient1offer,
                },
            )
        else:
            ProductVariant.objects.update_or_create(
                product=product,
                name=varientname1,
                defaults={
                    "price": varient1price,
                    "quantity": varient1quantity,
                    "offer_price": varient1offer,
                },
            )

    if varientname2 and varient2quantity and varient2price:
        if (
            varientimage2 and varientimage2 != "undefined"
        ):  # Check for undefined or missing file
            ProductVariant.objects.update_or_create(
                product=product,
                name=varientname2,
                defaults={
                    "image": varientimage2,
                    "price": varient2price,
                    "quantity": varient2quantity,
                    "offer_price": varient2offer,
                },
            )
        else:
            ProductVariant.objects.update_or_create(
                product=product,
                name=varientname2,
                defaults={
                    "price": varient2price,
                    "quantity": varient2quantity,
                    "offer_price": varient2offer,
                },
            )

    return JsonResponse(
        {"message": "Product updated successfully"}, status=status.HTTP_200_OK
    )


@api_view(["get"])
@permission_classes([IsAuthenticated])
@admin_required
def getallproduct(request):
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

    img = list(ProductImage.objects.values("image", "product_id"))
    varient = list(
        ProductVariant.objects.values(
            "name", "image", "price", "quantity", "product_id"
        )
    )
    return JsonResponse({"products": [p, img, varient]}, safe=False)


@api_view(["get"])
@permission_classes([IsAuthenticated])
@admin_required
def getallusers(requests):
    data = list(
        User.objects.values(
            "id",
            "first_name",
            "email",
            "phone",
            "status",
        )
    )
    return JsonResponse({"users": data})


@api_view(["post"])
@permission_classes([IsAuthenticated])
@admin_required
def editstatus(request):
    data = json.loads(request.body)
    user_id = data.get("userId")
    status = data.get("status")
    user = User.objects.get(id=user_id)
    user.status = status
    user.save()
    return HttpResponse("success status changed", status=200)


@api_view(["get"])
@permission_classes([IsAuthenticated])
@admin_required
def delete_product_with_id(request, id):
    product = Product.objects.get(product_id=id)
    product.is_active = False
    product.save()
    return HttpResponse("product deleted successfully", status=200)


@api_view(["GET"])
def get_all_orders(request):
    products = list(
        OrderItem.objects.values(
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
            "paymenttype",
        )
    )

    # ordered_products=list(OrderItem.objects.filter(order_id=request.user.id))
    # print(ordered_products)
    return JsonResponse({"orders": products})


def update_status(request, id):
    data = json.loads(request.body)
    status = data.get("status")
    v = OrderItem.objects.get(id=id)
    v.status = status
    v.save()
    return HttpResponse("status updated succesfully ")


def get_all_order_details(request, id):
    order_detail = list(
        OrderItem.objects.filter(id=id).values(
            "id",
            "quantity",
            "order_id",
            "img",
            "created_at",
            "status",
            "price",
            "order_id__address__street_address",  # Address fields
            "order_id__address__apartment_address",
            "order_id__address__city",
            "order_id__address__district",
            "order_id__address__state",
            "order_id__address__country",
            "order_id__address__postal_code",
            "order_id__address__phone_number",
            "order_id__address__is_billing",
            "order_id__address__is_shipping",
            # User fields
            "order_id__address__user__id",  # Foreign key to User
            "order_id__address__user__first_name",
            "order_id__address__user__last_name",
            "order_id__address__user__email",
            "order_id__address__user__role",
            "order_id__address__user__status",
            "order_id__address__user__phone",
            "order_id__address__user__dob",
            "order_id__address__user__location",
            "order_id__address__user__state",
            "order_id__address__user__country",
            "order_id__address__user__pin",
            "product_id",
            "product_id__name",
            "product_id__description",
            "product_id__category_id__name",
            "variant_id",
            "variant_id__name",
            "total_product_price",
            "paymenttype",
        )
    )

    return JsonResponse({"order": order_detail})
