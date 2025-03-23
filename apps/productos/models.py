from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.


class Producto(models.Model):

    descripcion= models.TextField(max_length=100,null=True)
    precio= models.FloatField(validators=[MinValueValidator(0)])
    cantidad= models.FloatField(validators=[MinValueValidator(0)])
    cantidad_minima= models.FloatField(validators=[MinValueValidator(0)])
    unidad_medida= models.CharField(max_length=10)
    estado=models.BooleanField(default=True)
    categoria = models.CharField(max_length=15)

    def __str__(self):
        return f"{self. descripcion} (precio:{self.precio}) (cant:{self.cantidad})"

#opcion: mandar esos 2 y con las expReg en js capturar el precio del option seleccionado