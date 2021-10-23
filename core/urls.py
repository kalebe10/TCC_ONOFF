from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from token_jwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


from core.views import (index,
                        corpo,
                        login,
                        modulo,
                        sala,
                        andar,
                        agendador,
                        loading,
                        menu,
                        controle_modulo,
                        controle_andar,
                        controle_sala,
                        secret)

from api.viewsets import (
    ModuloViewSet, SalaViewSet, AndarViewSet,
    AgendadorViewSet, UserViewSet, AndarAtivaViewSet,
    ModuloAtivaViewSet, SalaAtivaViewSet,
    AgendadorAtivaViewSet, usuariosViewSet,
    CadastraModuloViewSet, SecretViewSet,
)

from api.views.agendador import Agendador_Start_ViewSet
from api.views.modulo import Protocolo_ViewSet, Alexa_ViewSet

ROUTER = routers.SimpleRouter()
ROUTER.register(r'modulo', ModuloViewSet, basename="Modulo")
ROUTER.register(r'moduloAtiva', ModuloAtivaViewSet, basename="ModuloAtiva")

ROUTER.register(r'sala', SalaViewSet, basename="Sala")
ROUTER.register(r'salaAtiva', SalaAtivaViewSet, basename="SalaAtiva")

ROUTER.register(r'andar', AndarViewSet, basename="Andar")
ROUTER.register(r'andarAtiva', AndarAtivaViewSet, basename="AndarAtiva")

ROUTER.register(r'agendador', AgendadorViewSet, basename="Agendador")
ROUTER.register(r'agendadorAtiva', AgendadorAtivaViewSet,
                basename="AgendadorAtiva")
ROUTER.register(r'agendadorStart', Agendador_Start_ViewSet,
                basename="AgendadorStart")

ROUTER.register(r'user', UserViewSet, basename="User")
ROUTER.register(r'usuarios', usuariosViewSet, basename="usuarios")

ROUTER.register(r'automacao', Protocolo_ViewSet, basename="automacao")
ROUTER.register(r'alexa', Alexa_ViewSet, basename="alexa")

ROUTER.register(r'secret', SecretViewSet, basename="secret")

ROUTER.register(r'cadastraModulo', CadastraModuloViewSet,
                basename="cadastraModulo")

urlpatterns = [
    path('api/', include(ROUTER.urls)),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('', index),
    path('web/corpo', corpo),
    path('web/login', login, name='login'),
    path('web/modulo', modulo, name='modulo'),
    path('web/sala', sala, name='sala'),
    path('web/andar', andar, name='andar'),
    path('web/agendador', agendador, name='agendador'),
    path('web/loading', loading, name='loading'),
    path('web/menu', menu, name='menu'),
    path('web/controle_modulo', controle_modulo, name='controle_modulo'),
    path('web/controle_andar', controle_andar, name='controle_andar'),
    path('web/controle_sala', controle_sala, name='controle_sala'),
    path('web/secret', secret, name='secret'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
