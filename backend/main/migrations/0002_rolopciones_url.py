# Generated by Django 4.2.17 on 2024-12-20 06:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='rolopciones',
            name='Url',
            field=models.CharField(default='/', max_length=100),
        ),
    ]
