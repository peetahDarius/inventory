# Generated by Django 5.1.7 on 2025-03-18 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='read_by',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
