from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from main.views import (PersonaViewSet, UsuarioViewSet, RolViewSet, RolOpcionesViewSet, RolUsuarioViewSet,
                        RolRolOpcionesViewSet, SessionViewSet, InfoDatosBienvenidaView, InfoDashboardView,
                        MenuUsuarioView, LoginView, LogoutView, RecuperarContresenaView, CrearUsuariosView)

router = routers.DefaultRouter()
router.register(r'personas', PersonaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'roles', RolViewSet)
router.register(r'roles_opciones', RolOpcionesViewSet)
router.register(r'roles_usuarios', RolUsuarioViewSet)
router.register(r'rol_roles_usuarios', RolRolOpcionesViewSet)
router.register(r'sessions', SessionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/info_bienvenida/<int:pk>/', InfoDatosBienvenidaView.as_view(), name='info_bienvenida'),
    path('api/info_dashboard/', InfoDashboardView.as_view(), name='info_dashboard'),
    path('api/menu_usuario/<int:pk>/', MenuUsuarioView.as_view(), name='menu_usuario'),

    path('api/ingreso_masivo/', CrearUsuariosView.as_view(), name='ingreso_masivo'),

    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/<int:pk>/', LogoutView.as_view(), name='logout'),
    path('api/recuperar_contrasena/', RecuperarContresenaView.as_view(), name='recuperar_contrasena'),

]
