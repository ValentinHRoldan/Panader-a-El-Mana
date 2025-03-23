from django import forms
from .models import Producto

class ProductoForm(forms.ModelForm):
    
    categorias = [("", "Seleccione"), ("PAN", "Panificación"), ("PAS", "Pastelería")]
    categoria = forms.ChoiceField(choices=categorias,
                widget=forms.Select(attrs={'class': 'formulario__input','id':'categoria_producto',}))
    
    unidades_de_medida = [("", "Seleccione"), ("kg", "Kilogramos"), ("unidades", "Unidades")]
    unidad_medida = forms.ChoiceField(choices=unidades_de_medida,
                widget=forms.Select(attrs={'class': 'formulario__input','id':'unidad_medida',}))

    class Meta:

        model = Producto
        fields = ['descripcion', 'precio', 'cantidad', 'cantidad_minima', 'unidad_medida', 'categoria']

        widgets = {

            'descripcion': forms.TextInput(attrs={
                'class': 'formulario__input', 
                'id': 'descripcion_producto',
               
            }),
            'precio': forms.NumberInput(attrs={
                'class': 'formulario__input', 
                'id': 'precio_producto',
            }),
            'cantidad': forms.NumberInput(attrs={
                'class': 'formulario__input', 
                'id': 'cantidad_producto',
            }),
            'cantidad_minima': forms.NumberInput(attrs={
                'class': 'formulario__input', 
                'id': 'cantidad_minima_producto',
            })
        }

 