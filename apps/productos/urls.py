from django.urls import path
from apps.productos import views 

app_name = 'productos'
urlpatterns = [
    path('', views.gestionarProductos, name='gestionarProductos'),
    path('baja_cantidad', views.productosCantidadBaja, name='baja_cantidad'),
    path('editar/<int:pk>', views.editarProductos, name='editar_productos'),
    path('eliminar/<int:pk>', views.eliminarProductos, name='eliminar_productos'),
    path('informe', views.informeProductos, name='informe_productos'),
]