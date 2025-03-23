from django import forms
from .models import Venta, Producto, ItemProducto, Mayorista
from django.forms import inlineformset_factory, DateInput
import datetime


class ventasForm(forms.ModelForm):
    mayorista = forms.ModelChoiceField(
        queryset=Mayorista.objects.filter(estado=True),
        empty_label="Seleccione",  # Filtra solo los insumos activos
        required=False,
        widget=forms.Select(attrs={
            'class': 'formulario__input',
            'id':'nombreMayorista',
            'name': 'mayorista'
        })
    )
    observaciones = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'formulario__input',
            'id': 'observaciones',
            'name': 'observaciones',
            'placeholder': 'Opcional'
        })
    )
    TIPO_VENTA_CHOICES = [
        ('MINORISTA', 'Minorista'),  # Primer valor es el que se guarda en la BD, el segundo es el que se muestra
        ('MAYORISTA', 'Mayorista')  
    ]
    tipo_venta = forms.ChoiceField(choices=TIPO_VENTA_CHOICES,
                widget=forms.Select(attrs={
                'class': 'formulario__input',
                'id': 'tipo_venta',
                'name': 'tipo_venta'}))
    class Meta:
        model = Venta
        fields = ['mayorista', 'tipo_venta', 'FechaVenta', 'tipo_comprobante', 'numeroComprobante', 'forma_pago', 'observaciones', 'precioTotal']   

        widgets = {
            'FechaVenta': DateInput(attrs={
                'type': 'date',
                'class': 'formulario__input',
                'name': 'fechaSolicitud',
                'id': 'fechaVenta'
            }),
            'tipo_comprobante': forms.Select(attrs={
                'class': 'formulario__input',
                'id': 'tipoComprobante',
                'name': 'tipoComprobante'
            }),
            'numeroComprobante': forms.NumberInput(attrs={
                'class': 'formulario__input',
                'id': 'nroComprobante',
                'name': 'nroComprobante',
                'readonly': 'readonly'
            }),
            'forma_pago': forms.Select(attrs={
                'class': 'formulario__input',
                'id': 'formaPago',
                'name': 'formaPago'                 
            }),
            'precioTotal': forms.TextInput(attrs={
                'class': 'formulario__input',
                'id': 'precioTotal',
                'name': 'precioTotal',
                'readonly': 'readonly'                
            }),
        }

                # 'class': '',
                # 'id': '',
                # 'name': ''


class ProductoForm(forms.ModelForm):
    producto = forms.ModelChoiceField(
        queryset=Producto.objects.filter(estado=True),
        empty_label="Seleccione",  # Filtra solo los insumos activos
        widget=forms.Select(attrs={
            'class': 'formulario__input',
            'id':'selectProducto',
            'required': 'required'
        })
    )
    subtotal = forms.FloatField(widget=forms.HiddenInput())
    class Meta:
        model = ItemProducto
        fields = ['producto', 'cantidad', 'precioActual', 'subtotal']
        widget = {
            'precioActual': forms.NumberInput(attrs={
                'class': 'formulario__input',
                'id': 'precioActual',
                'name': 'precioActual'
            }),
            'cantidad': forms.NumberInput(attrs={
                'class': 'formulario__input',
                'id': 'cantidad',
                'name': 'cantidad'              
            }),
            
        }

ItemProductoFormSet = inlineformset_factory(
    Venta,  # El modelo padre
    ItemProducto,  # El modelo hijo que está relacionado con el padre
    form=ProductoForm,  # El formulario que creamos antes
    extra=1,  # Cuántos formularios extra queremos mostrar
    can_delete=True, 
)    