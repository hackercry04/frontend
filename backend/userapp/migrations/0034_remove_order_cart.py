# Generated by Django 5.0.6 on 2024-09-12 10:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("userapp", "0033_order_cart_order_status_alter_order_address"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="order",
            name="cart",
        ),
    ]