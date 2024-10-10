from models import (
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
)


o = OrderItem.objects.getall()
print(o)
