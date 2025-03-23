from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UsuarioForm
from .models import Usuario

# Register your models here.



# 
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    add_form= UsuarioForm
    model = Usuario

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'email','direccion','telefono','fecha_nacimiento','fecha_ingreso')}),
        ('Campos Personalizados', {'fields': ('cuit', 'perfil_usuario')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'cuit','direccion','telefono','fecha_nacimiento','fecha_ingreso', 'perfil_usuario', 'password1', 'password2'),
        }),
    )

    list_display = ('username', 'email', 'cuit', 'perfil_usuario', 'is_staff')
    search_fields = ('username', 'email', 'cuit')
    ordering = ('username',)

