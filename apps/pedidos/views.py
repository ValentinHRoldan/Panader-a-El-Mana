
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from .models import Insumo,Pedido,ItemInsumo,RecepcionPedidos
from .forms import PedidoForm, ItemInsumoFormSet,RecepcionForm, InsumoForm,RestarInsumoFormSet
from django.urls import reverse
from django.db.models import Q,F
from django.contrib.auth.decorators import login_required,permission_required
from django.db.models.functions import Abs



# Create your views here.

@login_required
@permission_required('pedidos.view_pedido', raise_exception=True)
def pedidos(request):
    pedidos=Pedido.objects.all().order_by('-id')
    return render (request, 'pedidos/Lista-pedidos.html',{
        'pedidos':pedidos
    })

@login_required
@permission_required('pedidos.add_pedido', raise_exception=True)
def registroPedidos(request):

    insumos= Insumo.objects.filter(estado=True)
    
    if request.method == 'POST':
        print('entro a pos')
        form = PedidoForm(request.POST,request.FILES)      
        print(form)
        if form.is_valid():
            print(' es valido')
            pedido = form.save()
            formset = ItemInsumoFormSet(request.POST, instance=pedido)
            print('formset',formset)
            
            if formset.is_valid():
                print('valido formest')
                formset.save()
                messages.success(request, 'pedido creado exitosamente.')
                return redirect('pedidos:lista_pedidos')
                
    else:
        form = PedidoForm()
        formset = ItemInsumoFormSet()

    return render(request, 'pedidos/Registro-gestion-pedidos.html', {
        'formPedido': form,
        'formset': formset,
        'insumos':insumos
    })



@login_required
@permission_required('pedidos.view_pedido', raise_exception=True)
def editarPedidos(request, pk):
    insumos= Insumo.objects.filter(estado=True)
    pedido = get_object_or_404(Pedido, pk=pk)
    if request.method == 'POST':
        form = PedidoForm(request.POST, request.FILES, instance=pedido)
        if form.is_valid():
            pedido = form.save()
            formset = ItemInsumoFormSet(request.POST, instance=pedido)
            if formset.is_valid():
                formset.save()
                messages.success(request, 'Pedido actualizado exitosamente.')
                return redirect('pedidos:lista_pedidos')
    else:
        form = PedidoForm(instance=pedido)
        formset = ItemInsumoFormSet(instance=pedido)

    return render(request, 'pedidos/Detalle-pedido.html', {
        'form': form,
        'formset': formset,
        'pedido': pedido,
        'insumos':insumos
    })


@login_required
@permission_required('pedidos.delete_pedido', raise_exception=True)
def cancelarPedido(request, pk):
    print("Cancelando pedido con ID:", pk)  # Agrega esta línea
    pedido = get_object_or_404(Pedido, pk=pk)
    
    if request.method == 'POST':
        pedido.estado = False
        pedido.save()
        messages.success(request, "El pedido ha sido cancelado exitosamente.")
        return redirect('pedidos:lista_pedidos')
    
    else:
        messages.error(request, "La cancelación no se pudo completar.")
        return redirect('pedidos:lista_pedidos')
    

@login_required
@permission_required('pedidos.view_recepcionpedidos', raise_exception=True)
def listaRecepcion(request):
    pedidos=Pedido.objects.all().order_by('-id')
    return render (request, 'pedidos/Lista-recepcion.html',{
        'pedidos':pedidos
    })


@login_required
@permission_required('pedidos.view_recepcionpedidos', raise_exception=True)
def recepcionarPedidos(request, pk):
    pedido = get_object_or_404(Pedido, pk=pk)
    formpedido = PedidoForm(request.POST, request.FILES, instance=pedido)
   

    if request.method == 'POST':
        form = RecepcionForm(request.POST,request.FILES)
        formset = ItemInsumoFormSet(request.POST,instance=pedido)
        print(form)
        if form.is_valid():
            recepcion = form.save(commit=False)  
            recepcion.pedido = pedido  
            recepcion.save()  

            for form in formset[:-1]:
                item_insumo = form.save(commit=False)
                insumo = item_insumo.insumo
                insumo.cantidad += item_insumo.cantidad
                insumo.save()      

            pedido.estado = False
            pedido.save()
            messages.success(request, 'Pedido reservado exitosamente.')
            return redirect('pedidos:listaRecepcion')
    else:
        form = RecepcionForm()
        formset = ItemInsumoFormSet(instance=pedido)

        
    return render(request, 'pedidos/Recepcion-pedido.html', {
        'form': form,
        'formPedido': formpedido,
        'formset': formset,
        'pedido':pedido
    })

@login_required
@permission_required('pedidos.view_insumo', raise_exception=True)
def gestionarInsumos(request):
    nuevo_insumo = None
    insumos = Insumo.objects.filter(estado=True)

    if request.method == 'POST':
        insumo_form = InsumoForm(request.POST, request.FILES)
        if insumo_form.is_valid():

            descripcion = insumo_form.cleaned_data['descripcion'].lower()

            if Insumo.objects.filter(Q(descripcion__iexact=descripcion), estado=True).exists():
                messages.error(request, 'El Insumo ya existe')
                return render(request, 'pedidos/Gestion-insumos.html', {'insumo_form': insumo_form,'insumos':insumos})
            else:
                nuevo_insumo = insumo_form.save(commit=False)
                nuevo_insumo.save()
                messages.success(
                request,
                "Insumo agregado exitosamente")
                return redirect(reverse('pedidos:gestionarInsumos'))
                
    else:
        insumo_form = InsumoForm()
    return render(request, 'pedidos/Gestion-insumos.html', {'insumo_form': insumo_form,'insumos':insumos})

@login_required
@permission_required('pedidos.change_insumo', raise_exception=True)
def editarInsumos(request, pk):
    insumos= Insumo.objects.filter(estado=True)
    insumo = get_object_or_404(Insumo, pk=pk)
    if request.method == 'POST':
        form = InsumoForm(request.POST, request.FILES, instance=insumo)
        if form.is_valid():

            descripcion = form.cleaned_data['descripcion'].lower()

            existe_insumo = Insumo.objects.filter(
                Q(descripcion__iexact=descripcion)
            , estado=True).exclude(id=insumo.id).exists()

            if existe_insumo:
                messages.error(request, 'El insumo ya existe')
                return render(request, 'pedidos/editar-insumos.html', {'form': form, 'insumo': insumo, 'insumos':insumos})
            insumo = form.save()
            messages.success(request, "El producto ha sido modificado exitosamente.")
            print('Datos recibidos:', request.POST)
            return redirect('pedidos:gestionarInsumos')
        
        return render(request, 'pedidos/editar-insumos.html', {
                'form': form,
                'insumo': insumo,
                'insumos': insumos,
            })
    else:
        form = InsumoForm(instance=insumo)

    return render(request, 'pedidos/editar-insumos.html', {
        'form': form,
        'insumo': insumo,
        'insumos': insumos
    })

@login_required
@permission_required('pedidos.delete_insumo', raise_exception=True)
def eliminarInsumos(request, pk):
    insumo = get_object_or_404(Insumo, pk=pk)
    
    if request.method == 'POST':
        print("Estado anterior:", insumo.estado)
        insumo.estado = False
        insumo.save()
        messages.success(request, "El insumo ha sido eliminado exitosamente.")
        return redirect('pedidos:gestionarInsumos')
    
    else:
        messages.error(request, "La eliminación no se pudo completar.")
        return redirect('pedidos:gestionarInsumos') 


@login_required
@permission_required('pedidos.change_insumo', raise_exception=True)
def restarInsumos(request):
    insumos= Insumo.objects.filter(estado=True)
    if request.method == 'POST':
        formset = RestarInsumoFormSet(request.POST)

        if formset.is_valid():
           for form in formset:
                insumo = form.cleaned_data.get('insumo')
                cantidad_restar = form.cleaned_data.get('cantidad_restar')
                insumo.cantidad -= cantidad_restar
                if insumo.cantidad<0:
                    messages.error(request, "La cantidad retirada no debe ser mayor a la cantidad disponible.")
                    return redirect('pedidos:restar_insumos')
                else:
                    insumo.save()
                    form.save()
        
        messages.success(request, 'Cantidad retirada exitosamente.')
        return redirect('pedidos:restar_insumos')
                
    else:
        formset = RestarInsumoFormSet()

    return render(request, 'pedidos/Restar-insumos.html', {
    
        'formset': formset,
        'insumos':insumos
    })
 
@login_required
@permission_required('pedidos.view_insumo', raise_exception=True)
def informeInsumos(request):
    productos = Insumo.objects.filter(estado=True)

    # Ordenar por cantidad disponible (cantidad - cantidad_minima)
    orden = request.GET.get('orden')
    if orden == 'asc':
        productos = productos.order_by(Abs(F('cantidad') - F('cantidad_minima')))
    elif orden == 'desc':
        productos = productos.order_by(Abs(F('cantidad') - F('cantidad_minima'))).reverse()

    return render(request, 'pedidos/informe-insumos.html', {
        'productos': productos,
        'orden': orden
    })