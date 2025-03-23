from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.decorators import login_required

# Create your views here.

def login_view(request):
    if request.user.is_authenticated:
        return redirect("usuarios:homeGestion")
    if request.method== "POST": 
        username = request.POST["username"] 
        password = request.POST["password"] 
        user = authenticate(request, username=username, password=password)    
        if user: 
            login(request, user)
           # if user.groups.filter(name="Almacenero").exists():
           #     return redirect(reverse('pedidos:registro_pedidos'))
            #elif user.groups.filter(name="Vendedor").exists():
            #    return redirect(reverse("ventas:registro_ventas"))
            #elif user.groups.filter(name="Gerente").exists():
            #    return redirect(reverse("ventas:informe_ventas"))
            #else:
            return redirect(reverse("usuarios:homeGestion"))
                
        else: 
            return render(request, "usuarios/login.html", {"msj": "Credenciales incorrectas"}) 
    return render(request, "usuarios/login.html")



@login_required
def logout_view(request):
    logout(request)
    return redirect("usuarios:login")


@login_required
def homeGestion(request):
    return render(request, "usuarios/base-home.html")