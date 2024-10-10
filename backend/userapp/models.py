from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# User Model
# Custom User Model
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]
    ROLE_CHOICES = [("admin", "admin"), ("user", "user")]

    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)  # Changed from username to email
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="inactive")
    is_admin = models.BooleanField(default=False)
    location = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    pin = models.CharField(max_length=10, null=True, blank=True)
    phone = models.CharField(max_length=10, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # Email is required for authentication

    objects = CustomUserManager()

    def __str__(self):
        return self.email


# Category Model
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    listed = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class OTP(models.Model):
    code = models.CharField(max_length=6, null=True)
    user_id = models.IntegerField(null=True)
    is_otp_expired = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    expired_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.expired_at:
            self.expired_at = timezone.now() + timedelta(minutes=5)
        # Automatically set the OTP to expired by default
        self.is_otp_expired = True
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expired_at


# Product Model
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    offer_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    quantity = models.PositiveIntegerField()
    in_stock = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    rating = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    is_active = models.BooleanField(default=True)  # New field
    # Automatically set on record creation

    def __str__(self):
        return self.name


# Product Image Model
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="products/images/")
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.product.name}"


# Variant Model
class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="variants"
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="products/variants/")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    offer_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    quantity = models.PositiveIntegerField(blank=True, null=True)
    in_stock = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} of {self.product.name}"


# Cart Model
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.name}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="variantdetials",
    )
    img = models.URLField(max_length=200, null=True)

    def __str__(self):
        return f"{self.quantity} of {self.product.name} in cart {self.cart.user.name}"


# Wishlist Model
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True)
    imageurl = models.URLField(max_length=200, null=True)

    def __str__(self):
        return f"{self.product.name} in wishlist of {self.user.name}"


class Address(models.Model):
    # ForeignKey to associate multiple addresses with one user
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")

    # Address fields
    street_address = models.CharField(max_length=255)
    title = models.CharField(max_length=255, null=True)

    apartment_address = models.CharField(
        max_length=255, blank=True, null=True
    )  # Optional
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100, null=True)

    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20, blank=True, null=True)  # Optional

    # Additional fields for e-commerce context
    is_billing = models.BooleanField(default=False)  # For marking billing addresses
    is_shipping = models.BooleanField(default=True)  # For marking shipping addresses

    # Date tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # New field

    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.country}"


# Order Model
class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    products = models.ManyToManyField(Product, through="OrderItem")
    address = models.ForeignKey(
        Address, on_delete=models.DO_NOTHING, related_name="address", null=True
    )
    status = models.CharField(max_length=50, default="pending")
    payment_method = models.CharField(max_length=100, default="no method specified")

    created_at = models.DateTimeField(auto_now_add=True)


# Coupon Model
class Coupon(models.Model):
    coupon_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=50, unique=True)  # code -> couponCode
    discountType = models.CharField(max_length=50)
    discountSection = models.CharField(
        max_length=50, null=True
    )  # coupon_type -> discountType
    discountValue = models.IntegerField()  # discount -> discountValue
    expiryDate = models.DateField()  # expiration_date -> expiryDate
    selectedCategory = models.ForeignKey(
        Category, max_length=100, null=True, on_delete=models.DO_NOTHING
    )  # New field for categories
    selectedProduct = models.ForeignKey(
        Product, max_length=100, null=True, on_delete=models.DO_NOTHING
    )  # New field for products
    limit = models.PositiveIntegerField(default=0)
    description = models.TextField()
    use_count = models.IntegerField(default=0)
    valid = models.BooleanField(default=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(
        ProductVariant, on_delete=models.SET_NULL, null=True, blank=True
    )
    quantity = models.PositiveIntegerField(default=1)
    img = models.CharField(null=True, max_length=250)
    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    price = models.PositiveBigIntegerField(default=1)
    user_id = models.PositiveBigIntegerField(null=True)
    total_product_price = models.PositiveBigIntegerField(null=True)
    coupon = models.ForeignKey(
        Coupon, null=True, max_length=250, on_delete=models.CASCADE
    )
    paymenttype = models.CharField(max_length=50, null=True)
    reason = models.CharField(max_length=500, null=True)
    is_payed = models.BooleanField(default=False)


# Payment Model
class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    payment_id = models.AutoField(primary_key=True)
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name="payment"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(
        max_length=10, choices=PAYMENT_STATUS_CHOICES, default="pending"
    )
    payment_method = models.CharField(max_length=50)

    def __str__(self):
        return f"Payment {self.payment_id} for order {self.order.order_id}"


# Banner Model
class Banner(models.Model):
    banner_id = models.AutoField(primary_key=True)
    image_url = models.URLField()
    link = models.URLField(blank=True, null=True)
    position = models.CharField(max_length=50)

    def __str__(self):
        return f"Banner {self.position}"


# Address model


class Wallet(models.Model):
    id = models.AutoField(primary_key=True)
    orderitem = models.ForeignKey(OrderItem, on_delete=models.DO_NOTHING, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    amount = models.DecimalField(decimal_places=2, max_digits=50)
    created_at = models.DateTimeField(auto_now_add=True, null=True)


# Sales Report Model (optional depending on your requirements)
class SalesReport(models.Model):
    report_id = models.AutoField(primary_key=True)
    start_date = models.DateField()
    end_date = models.DateField()
    total_sales = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Sales Report {self.start_date} - {self.end_date}"


class Walletamount(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    balance = models.DecimalField(max_digits=50, decimal_places=2)
