# Generated by Django 5.0.6 on 2024-09-12 09:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userapp", "0032_order_address"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="cart",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="address",
                to="userapp.cart",
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="status",
            field=models.CharField(default="pending", max_length=50),
        ),
        migrations.AlterField(
            model_name="order",
            name="address",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="address",
                to="userapp.address",
            ),
        ),
    ]