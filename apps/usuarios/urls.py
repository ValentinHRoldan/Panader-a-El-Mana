from django.urls import path
from apps.usuarios import views 

app_name = 'usuarios'
urlpatterns = [
    path('login/', views.login_view, name='login'),
    path("logout/", views.logout_view, name="logout"),
    path("home/", views.homeGestion, name="homeGestion")

]