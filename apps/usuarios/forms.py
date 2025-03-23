from django.contrib.auth.forms import UserCreationForm
from .models import Usuario



class UsuarioForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Usuario
        fields = UserCreationForm.Meta.fields+('cuit','direccion','telefono','fecha_nacimiento','fecha_ingreso','perfil_usuario')