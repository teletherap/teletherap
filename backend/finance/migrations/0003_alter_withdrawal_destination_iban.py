# Generated by Django 4.1 on 2022-08-08 21:27

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='withdrawal',
            name='destination_iban',
            field=models.CharField(max_length=255, null=True, validators=[django.core.validators.RegexValidator('^([a-zA-Z0-9]{26})$', 'IBAN is not correct.')]),
        ),
    ]