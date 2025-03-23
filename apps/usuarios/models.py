from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.



class Usuario(AbstractUser):
    cuit = models.CharField(max_length=11, unique=True)
    direccion = models.CharField(max_length=255,blank=True)
    telefono = models.CharField(max_length=20,blank=True)
    fecha_nacimiento = models.DateField(blank=True,null=True)
    fecha_ingreso = models.DateField(blank=True,null=True)
    PERFILES_USUARIO = [
    ('Administrador', 'Administrador'),
    ('Vendedor', 'Vendedor'),
    ('Almacenero', 'Almacenero'),
    ('Gerente', 'Gerente'),
    ]
    perfil_usuario = models.CharField(max_length=50, choices=PERFILES_USUARIO)

