# Generated by Django 5.1.1 on 2024-09-24 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userapp", "0053_wallet_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="wallet",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]