import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Insumo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.TextField(max_length=100, null=True)),
                ('cantidad', models.FloatField()),
                ('estado', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Proveedor',
            fields=[
                ('cuit', models.CharField(max_length=11, primary_key=True, serialize=False)),
                ('nombre', models.TextField(max_length=50)),
                ('email', models.CharField(max_length=50)),
                ('direccion', models.TextField(max_length=50)),
                ('telefono', models.CharField(max_length=20)),
                ('estado', models.BooleanField(verbose_name=False)),
            ],
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_pedido', models.DateField(auto_now=True)),
                ('observaciones', models.TextField(blank=True, max_length=100, null=True)),
                ('cantidad', models.FloatField()),
                ('insumos', models.ManyToManyField(to='pedidos.insumo')),
                ('proveedor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pedidos.proveedor')),
            ],
        ),
    ]
