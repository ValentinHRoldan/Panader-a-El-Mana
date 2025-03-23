

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('productos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mayorista',
            fields=[
                ('cuit', models.CharField(max_length=11, primary_key=True, serialize=False)),
                ('razon_social', models.CharField(max_length=20)),
                ('direccion', models.TextField(max_length=50)),
                ('telefono', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=50)),
                ('condicion_venta', models.CharField(choices=[('CONTADO', 'Contado'), ('CREDITO', 'Credito')], max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='Venta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numeroComprobante', models.IntegerField()),
                ('FechaVenta', models.DateField(auto_now=True)),
                ('precioTotal', models.FloatField()),
                ('observaciones', models.TextField(max_length=200)),
                ('tipo_venta', models.CharField(choices=[('MINORISTA', 'Minorista'), ('MAYORISTA', 'Mayorista')], max_length=15)),
                ('tipo_comprobante', models.CharField(choices=[('RECIBO', 'Recibo'), ('FACTURA', 'Factura'), ('OTRO', 'Otro')], max_length=15)),
                ('forma_pago', models.CharField(choices=[('CONTADO', 'Contado'), ('TRANSFERENCIA', 'Transferencia'), ('CREDITO', 'Credito'), ('OTRO', 'Otro')], max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='ItemProducto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('precioActual', models.FloatField()),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='productos.producto')),
                ('venta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.venta')),
            ],
        ),
    ]
