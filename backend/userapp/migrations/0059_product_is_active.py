# Generated by Django 5.1.1 on 2024-10-09 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userapp", "0058_orderitem_reason"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
    ]