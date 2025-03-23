from django.http import JsonResponse
from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from .forms import ProductoForm
from .models import Producto
from django.db.models import Q
from django.contrib.auth.decorators import login_required,permission_required
from django.db.models import F
from django.db.models.functions import Abs


@login_required
def productosCantidadBaja(request):
    productos = Producto.objects.filter(cantidad__lte=F('cantidad_minima'), estado=True).values('id', 'cantidad_minima','descripcion', 'cantidad')
    return JsonResponse(list(productos), safe=False)



@login_required
@permission_required('productos.view_producto', raise_exception=True)
def gestionarProductos(request):
    nuevo_producto = None
    productos = Producto.objects.filter(estado=True)

    if request.method == 'POST':
        producto_form = ProductoForm(request.POST, request.FILES)
        if producto_form.is_valid():

            descripcion = producto_form.cleaned_data['descripcion'].lower()

            if Producto.objects.filter(Q(descripcion__iexact=descripcion), estado=True).exists():
                messages.error(request, 'El producto ya existe')
                return render(request, 'productos/Gestion-productos.html', {'producto_form': producto_form,'productos':productos})
            else:
                nuevo_producto = producto_form.save(commit=False)
                nuevo_producto.save()
                messages.success(
                request,
                "Producto agregado exitosamente")
                return redirect(reverse('productos:gestionarProductos'))
                
    else:
        producto_form = ProductoForm()
    return render(request, 'productos/Gestion-productos.html', {'producto_form': producto_form,'productos':productos})


@login_required
@permission_required('productos.change_producto', raise_exception=True)
def editarProductos(request, pk):
    productos= Producto.objects.filter(estado=True)
    producto = get_object_or_404(Producto, pk=pk)
    if request.method == 'POST':
        form = ProductoForm(request.POST, request.FILES, instance=producto)
        if form.is_valid():

            descripcion = form.cleaned_data['descripcion'].lower()

            existe_producto = Producto.objects.filter(
                Q(descripcion__iexact=descripcion)
            , estado=True).exclude(id=producto.id).exists()

            if existe_producto:
                messages.error(request, 'El producto ya existe')
                return render(request, 'productos/editar-productos.html', {'form': form, 'producto': producto, 'productos':productos})
            producto = form.save()
            messages.success(request, "El producto ha sido modificado exitosamente.")
            print('Datos recibidos:', request.POST)
            return redirect('productos:gestionarProductos')
        
        return render(request, 'productos/editar-productos.html', {
                'form': form,
                'producto': producto,
                'productos': productos,
            })
    else:
        form = ProductoForm(instance=producto)

    return render(request, 'productos/editar-productos.html', {
        'form': form,
        'producto': producto,
        'productos': productos
    })


@login_required
@permission_required('productos.delete_producto', raise_exception=True)
def eliminarProductos(request, pk):
    producto = get_object_or_404(Producto, pk=pk)
    
    if request.method == 'POST':
        print("Estado anterior:", producto.estado)
        producto.estado = False
        producto.save()
        messages.success(request, "El producto ha sido eliminado exitosamente.")
        return redirect('productos:gestionarProductos')
    
    else:
        messages.error(request, "La cancelación no se pudo completar.")
        return redirect('productos:gestionarProductos')

@login_required
@permission_required('productos.view_producto', raise_exception=True)
def informeProductos(request):
    productos = Producto.objects.filter(estado=True)

    # Filtrar por categoría (si se proporciona)
    categoria = request.GET.get('categoria')
    if categoria:
        productos = productos.filter(categoria=categoria)

    # Ordenar por cantidad disponible (cantidad - cantidad_minima)
    orden = request.GET.get('orden')
    if orden == 'asc':
        productos = productos.order_by(Abs(F('cantidad') - F('cantidad_minima')))
    elif orden == 'desc':
        productos = productos.order_by(Abs(F('cantidad') - F('cantidad_minima'))).reverse()

    return render(request, 'productos/Informe-productos.html', {
        'productos': productos,
        'categoria_seleccionada': categoria,
        'orden': orden
    })