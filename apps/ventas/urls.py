from django.urls import path
from apps.ventas import views 

app_name = 'ventas'
urlpatterns = [
    path('', views.registroVentas, name='registro_ventas'),
    path('informe/', views.informeVentas, name="informe_ventas"),
    path('crearMayorista/', views.registroMayoristas, name="registro_mayoristas"),
    path("informe/<int:id>", views.detalleVenta, name="detalle_venta"),
    path("anular/<int:id>", views.anularVenta, name="anular_venta"),
    path("informe/mayoristas/", views.informeMayoristas, name="informe_mayoristas"),
    path("informe/mayoristas/darBaja/<int:cuit>", views.darDeBajaMayorista, name="baja_mayorista"),
    path("informe/mayoristas/<int:cuit>", views.modificarMayorista, name='modificar_mayorista'),
    path("informe/mayoristas/detalles/<int:cuit>", views.detallesMayorista, name="detalles_mayorista"),
    path('informe_ventas_pdf/', views.generar_informe_pdf, name='informe_ventas_pdf')
]