from django.db import models

# Create your models here.

class Proveedor(models.Model):
    cuit= models.CharField(max_length=11,primary_key=True)
    nombre= models.TextField(max_length=50)
    email= models.CharField(max_length=50)
    direccion= models.TextField(max_length=50)
    telefono= models.CharField(max_length=20)
    estado=models.BooleanField(default=True)

    def __str__(self):
        return f"{self. nombre}"





class Insumo(models.Model):

    descripcion= models.TextField(max_length=100,null=True)
    cantidad= models.FloatField()
    cantidad_minima= models.FloatField()
    unidad_medida= models.CharField(max_length=10,blank=True)
    estado=models.BooleanField(default=True)

    def __str__(self):
        return f"{self.descripcion}"





class Pedido(models.Model):

    fecha_pedido= models.DateField()
    observaciones= models.TextField(max_length=100 ,blank=True, null=True)
    proveedor= models.ForeignKey(Proveedor,on_delete=models.CASCADE)
    estado=models.BooleanField(default=True)

    def __str__(self):
        return f"Fecha de pedido: {self.fecha_pedido} Observaciones: {self.observaciones} proveedor: {self.proveedor.nombre}"



class ItemInsumo(models.Model):
    pedido= models.ForeignKey(Pedido, on_delete=models.CASCADE,related_name="insumos")
    insumo= models.ForeignKey(Insumo, on_delete=models.CASCADE)
    cantidad= models.FloatField()
    unidad_medida= models.CharField(max_length=10,blank=True)




class RecepcionPedidos(models.Model):
    
    fecha_llegada=models.DateField(auto_now=True)
    observacion= models.TextField(max_length=100 ,blank=True, null=True)
    conformidad= models.BooleanField()
    precio_total= models.FloatField(default=0)   
    pedido= models.ForeignKey(Pedido,on_delete=models.CASCADE)
    

class RestarInsumos(models.Model):
    insumo= models.ForeignKey(Insumo, on_delete=models.CASCADE)
    unidad_medida= models.CharField(max_length=10,blank=True)
    cantidad_restar= models.FloatField()