# Generated by Django 4.2.17 on 2024-12-20 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_session_fechacierre_alter_session_fechaingreso'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='FechaCierre',
            field=models.DateTimeField(null=True),
        ),
    ]
