from django.contrib import messages
from django.shortcuts import get_object_or_404, render, redirect
from django.db.models import Prefetch, F
from django.urls import reverse
from .forms import ventasForm, ItemProductoFormSet
from .models import itemMayorista, Venta, ItemProducto, Mayorista, itemUsuario
from apps.productos.models import Producto
from django.db import transaction
from django.contrib.auth.decorators import login_required,permission_required
# Create your views here.
from django.http import HttpResponse
from django.template.loader import render_to_string

@login_required
@permission_required('ventas.add_venta', raise_exception=True)
def registroVentas(request):
    if request.method == "POST":
        form = ventasForm(request.POST, request.FILES) 
        if form.is_valid():
            tipoVenta = form.cleaned_data.get('tipo_venta')
            try:
                with transaction.atomic():
                    ventaNueva = form.save()
                    if tipoVenta == 'MAYORISTA':
                        idMayorista = request.POST.get("cuitMayorista")
                        nuevaVentaMayorista = itemMayorista(
                            venta=ventaNueva,
                            mayorista_cuit_id=idMayorista
                        )
                        nuevaVentaMayorista.save()
                    idUsuario = request.POST.get("id_usuario")    
                    venta_usuario = itemUsuario(
                        venta = ventaNueva,
                        usuario_id = idUsuario
                    )
                    venta_usuario.save()
                    formset = ItemProductoFormSet(request.POST, instance=ventaNueva)
                    if formset.is_valid():
                        formset.save()
                        messages.success(request, "La venta se ha realizado exitosamente.")
                    else:
                        raise ValueError("Error en formset")
                    return redirect(f'http://{request.get_host()}/ventas/')
            except Exception as e:
                if "id_producto" in str(e):
                    mensaje_error = "CANTIDAD INVALIDA! LA VENTA NO SE PUDO REALIZAR"
                else:
                    mensaje_error = str(e)
                messages.error(request, mensaje_error)
                return redirect(reverse('ventas:registro_ventas'))
    form = ventasForm()
    formset = ItemProductoFormSet()
    return render(request, 'ventas/Registro_gestion_ventas.html', {'formVenta':form, 'formset':formset, 'id_usuario': request.user.id})    



@login_required
@permission_required('ventas.view_venta', raise_exception=True)
def informeVentas(request):
    ventas = Venta.objects.filter(itemusuario__isnull=False).select_related(
        'itemusuario__usuario'
    ).annotate(
        username=F('itemusuario__usuario__username')
    ).values(
        'id', 'numeroComprobante', 'FechaVenta', 'precioTotal',
        'observaciones', 'tipo_venta', 'tipo_comprobante', 'forma_pago', 'estado', 'username'
    ).order_by('-id') 
    return render (request, 'ventas/Lista_ventas.html',{
        'ventas': ventas
    })   

            # print(request.POST)  # Ver los datos que se están enviando
            # print(formset.errors) 
            # print(f'Número de formularios: {len(formset.save())}')  # Para ver cuántos formularios están en el formset


@login_required
@permission_required('ventas.view_venta', raise_exception=True)
def detalleVenta(request, id):
    venta_productos = (
        Venta.objects
        .filter(id=id)  # Filtra solo la venta específica
        .select_related("itemmayorista__mayorista_cuit")  # Para acceder a los datos del mayorista
        .prefetch_related(
            Prefetch("itemproducto_set", queryset=ItemProducto.objects.select_related("producto")),
            Prefetch("itemusuario_set", queryset=itemUsuario.objects.select_related("usuario"))
        )
        .values(
            "id", 
            "numeroComprobante", 
            "FechaVenta", 
            "precioTotal", 
            "observaciones", 
            "tipo_venta", 
            "tipo_comprobante", 
            "forma_pago", 
            "estado",
            # Campos de ItemProducto
            "itemproducto__producto_id", 
            "itemproducto__producto__descripcion", 
            "itemproducto__precioActual", 
            "itemproducto__cantidad", 
            "itemproducto__subtotal",
            "itemproducto__producto__categoria", 
            # Campos de Mayorista
            "itemmayorista__mayorista_cuit__cuit", 
            "itemmayorista__mayorista_cuit__razon_social",
            # Campos de Usuario asociado
            "itemusuario__usuario__cuit", 
            "itemusuario__usuario__username", 
            "itemusuario__usuario__email"
        )
    )
    return render(request, 'ventas/Detalles_venta.html', {'venta_productos':venta_productos})


def devolverCantidadStock(lst_venta_productos):
    for producto_venta in lst_venta_productos:
        idProducto = producto_venta['producto_id']
        cantidadVendida = producto_venta['cantidad']
        producto = get_object_or_404(Producto, id = idProducto)
        producto.cantidad += cantidadVendida
        producto.save()


@login_required
@permission_required('ventas.delete_venta', raise_exception=True)
def anularVenta(request, id):
    if request.method == 'POST':
        venta = get_object_or_404(Venta, id=id)
        productosAsociados = ItemProducto.objects.filter(venta_id=id).values('producto_id', 'cantidad')
        print(productosAsociados)
        devolverCantidadStock(productosAsociados)
        venta.estado = False
        venta.save()
        # messages.success(request, "La venta ha sido anulada exitosamente.")
        return redirect('ventas:informe_ventas')
    
    else:
        # messages.error(request, "La cancelación no se pudo completar.")
        return redirect('ventas:informe_ventas')


@login_required
@permission_required('ventas.add_mayorista', raise_exception=True)
def registroMayoristas(request):
    if request.method == 'POST':
        razonSocial = request.POST.get("razonSocial")
        cuit = request.POST.get("cuit")
        direccion = request.POST.get("direccion")
        telefono = request.POST.get("telefono")
        correo = request.POST.get("correo")
        condicionVenta = request.POST.get("condicionVenta")
        nuevoMayorista = Mayorista(
            cuit = cuit,
            razon_social = razonSocial,
            direccion = direccion,
            telefono = telefono,
            email = correo,
            condicion_venta = condicionVenta
        )
        nuevoMayorista.save()
    return render(request, 'ventas/Registro_mayoristas.html')


def informeMayoristas(request):
    mayoristas = Mayorista.objects.all()
    print(mayoristas)
    return render(request, "ventas/Lista_mayoristas.html", {'mayoristas':mayoristas})



def modificarMayorista(request, cuit):
    mayorista = get_object_or_404(Mayorista, cuit = cuit)
    if request.method == 'POST':
        mayorista.razon_social = request.POST.get("razonSocial")
        mayorista.cuit = request.POST.get("cuit")
        mayorista.direccion = request.POST.get("direccion")
        mayorista.telefono = request.POST.get("telefono")
        mayorista.email = request.POST.get("correo")
        mayorista.condicion_venta = request.POST.get("condicionVenta")
        mayorista.save()
        return redirect('ventas:informe_mayoristas')
    return render(request, "ventas/Modificar_mayorista.html", {'mayorista':mayorista})


def darDeBajaMayorista(request, cuit):
    if request.method == 'POST':
        mayorista = get_object_or_404(Mayorista, cuit = cuit)
        mayorista.estado = False
        mayorista.save()
        return redirect('ventas:informe_mayoristas')
    
def detallesMayorista(request, cuit):
    mayorista = get_object_or_404(Mayorista, cuit=cuit)
    return render(request, "ventas/Detalles_mayorista.html", {'mayorista':mayorista})


from django.http import HttpResponse
from fpdf import FPDF
from io import BytesIO
from .models import Venta  # Asegúrate de importar tu modelo Venta

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        self.add_page('L')
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Informe de Ventas - Panadería El Maná", 0, 1, "C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Página {self.page_no()}", 0, 0, "C")

@login_required
@permission_required('ventas.view_venta', raise_exception=True)
def generar_informe_pdf(request):
    # Filtra las ventas que tienen itemusuario asociado
    ventas = Venta.objects.filter(itemusuario__isnull=False).select_related(
        'itemusuario__usuario'
    ).annotate(
        username=F('itemusuario__usuario__first_name')
    ).values(
        'id', 'numeroComprobante', 'FechaVenta', 'precioTotal',
        'observaciones', 'tipo_venta', 'tipo_comprobante', 'forma_pago', 'estado', 'username'
    )

    # Crear instancia del PDF
    pdf = PDF()
    pdf.set_font("Arial", "B", 10)

    # Agregar encabezados de la tabla
    pdf.cell(20, 10, "ID", 1)
    pdf.cell(40, 10, "N° Comprobante", 1)
    pdf.cell(30, 10, "Fecha", 1)
    pdf.cell(50, 10, "Observaciones", 1)
    pdf.cell(30, 10, "Tipo de Venta", 1)
    pdf.cell(20, 10, "Estado", 1)
    pdf.cell(30, 10, "Vendedor", 1)  # Nueva columna para el nombre de usuario
    pdf.ln()

    # Agregar filas con datos de cada venta
    pdf.set_font("Arial", "", 10)
    for venta in ventas:
        pdf.cell(20, 10, str(venta['id']), 1)
        pdf.cell(40, 10, venta['numeroComprobante'], 1)
        pdf.cell(30, 10, venta['FechaVenta'].strftime("%Y-%m-%d"), 1)
        pdf.cell(50, 10, venta['observaciones'][:30], 1)  # Limita a 30 caracteres
        pdf.cell(30, 10, venta['tipo_venta'], 1)
        estado = "EXITOSA" if venta['estado'] else "ANULADA"
        pdf.cell(20, 10, estado, 1)
        pdf.cell(30, 10, venta['username'], 1)  # Agregar el nombre de usuario
        pdf.ln()

    # Guardar el PDF en un objeto BytesIO
    pdf_output = BytesIO()
    pdf.output(pdf_output)  # Escribe el PDF en el flujo de BytesIO
    pdf_output.seek(0)  # Asegúrate de colocar el cursor al inicio

    # Preparar la respuesta HTTP
    response = HttpResponse(pdf_output, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="informe_ventas.pdf"'
    
    return response