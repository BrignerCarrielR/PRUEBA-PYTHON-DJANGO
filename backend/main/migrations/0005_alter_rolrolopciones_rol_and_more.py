# Generated by Django 4.2.17 on 2024-12-20 21:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_alter_session_fechacierre'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rolrolopciones',
            name='Rol',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.rol'),
        ),
        migrations.AlterField(
            model_name='rolrolopciones',
            name='RolOpciones',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.rolopciones'),
        ),
        migrations.AlterField(
            model_name='rolusuario',
            name='Rol',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.rol'),
        ),
        migrations.AlterField(
            model_name='rolusuario',
            name='Usuario',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.usuario'),
        ),
        migrations.AlterField(
            model_name='session',
            name='Usuario',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.usuario'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='Persona',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.persona'),
        ),
        migrations.CreateModel(
            name='SessionReport',
            fields=[
                ('rideID', models.AutoField(primary_key=True, serialize=False)),
                ('xml_data', models.TextField()),
                ('userID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.usuario')),
            ],
        ),
    ]
