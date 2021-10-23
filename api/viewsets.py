from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from token_jwt.authentication import JWTAuthentication
from api.models import (Agendador, Andar, Modulo, Sala, User, Secret)
from .seriallizers import (AgendadorSerializer, AndarSerializer,
                           ModuloSerializer, SalaSerializer, UserSerializer,
                           SecretSerializer)
from api.CustomMixins.mixins import ModelViewSet


class ModuloViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Modulo.objects.all().order_by("apelido")
    serializer_class = ModuloSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'nome', 'ativo', 'mac', 'apelido', 'user')
    lookup_field = 'id'


class SecretViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Secret.objects.all().order_by("nome")
    serializer_class = SecretSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'nome', 'user')
    lookup_field = 'id'


class ModuloAtivaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Modulo.objects.all().filter(ativo=True).order_by("apelido")
    serializer_class = ModuloSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'nome', 'ativo', 'mac', 'apelido', 'user')
    lookup_field = 'id'


class SalaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Sala.objects.all().order_by("nome")
    serializer_class = SalaSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'nome', 'ativo', 'andar', 'user')
    lookup_field = 'id'


class SalaAtivaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Sala.objects.all().filter(ativo=True).order_by("nome")
    serializer_class = SalaSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'nome', 'ativo', 'andar', 'user')
    lookup_field = 'id'


class AndarViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Andar.objects.all().order_by("nome")
    serializer_class = AndarSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'nome', 'ativo', 'user')
    lookup_field = 'id'


class AndarAtivaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Andar.objects.all().filter(ativo=True).order_by("nome")
    serializer_class = AndarSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'nome', 'ativo', 'user')
    lookup_field = 'id'


class AgendadorViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Agendador.objects.all()
    serializer_class = AgendadorSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = (
        'id',
        'nome',
        'data',
        'hora',
        'dia_semana',
        'loop',
        'data_loop',
        'hora_loop',
        'ligar',
        'desligar',
        'modulo',
        'sala',
        'andar',
        'ativo',
        'data_hora',
        'tipo_acionamento',
        'data_inicio',
        'hora_inicio',
        'data_fim',
        'hora_fim',
        'minuto_loop', 'user')
    lookup_field = 'id'


class AgendadorAtivaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Agendador.objects.all().filter(ativo=True)
    serializer_class = AgendadorSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = (
        'id',
        'nome',
        'data',
        'hora',
        'dia_semana',
        'loop',
        'data_loop',
        'hora_loop',
        'ligar',
        'desligar',
        'modulo',
        'sala',
        'andar',
        'ativo',
        'data_hora',
        'tipo_acionamento',
        'data_inicio',
        'hora_inicio',
        'data_fim',
        'hora_fim',
        'minuto_loop', 'user')
    lookup_field = 'id'


class CadastraModuloViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        user = User.objects.filter(username=data['user']).first()
        if not user:
            saida = {"id": "", "ipMqtt": "broker.emqx.io", "portaMqtt": 1883}
            return Response(saida)

        modulo = Modulo.objects.filter(mac=data["mac"]).first()
        if modulo:
            saida = {
                "id": modulo.id,
                "ipMqtt": "broker.emqx.io",
                "portaMqtt": 1883
            }
            moduloUp = Modulo.objects.filter(id=modulo.id)
            moduloUp.update(user=user.pk, apelido="")
            return Response(saida)
        else:
            moduloN = Modulo.objects.filter(
                mac=data["mac"]).first()
            if moduloN:
                saida = {
                    "id": moduloN.id,
                    "ipMqtt": "broker.emqx.io",
                    "portaMqtt": 1883
                }
                return Response(saida)
            else:
                try:
                    moduloSalva = Modulo.objects.create(
                        nome=data["nome"], mac=data["mac"], user=user.pk)
                    moduloSalva.save()
                    saida = {
                        "id": moduloSalva.id,
                        "ipMqtt": "broker.emqx.io",
                        "portaMqtt": 1883
                    }
                    return Response(saida)
                except Exception:
                    return Response({"error": "erro ao gravar modulo"}, 500)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'username', 'nivel')
    lookup_field = 'username'

    def create(self, request, *args, **kwargs):
        user_cad = User.objects.create(
            username=request.data['username'],
            password=request.data['password'],
            nivel=request.data['nivel'], empresa=request.user.empresa)
        user_cad.save()
        user_cad = User.objects.get(username=request.data['username'])
        user_cad.set_password(request.data['password'])
        user_cad.save()

        data = {
            "username": request.data['username'],
            "nivel": request.data['nivel'],
        }
        return Response(data)

    def partial_update(self, request, *args, **kwargs):
        user_cad = User.objects.filter(
            username=kwargs['username'], empresa=request.user.empresa)
        user_cad.update(nivel=request.data['nivel'])
        if request.data['password'][0:3] != "pbk":
            user_cad = User.objects.get(username=kwargs['username'])
            user_cad.set_password(request.data['password'])
            user_cad.save()

        data = {
            "username": kwargs['username'],
            "nivel": request.data['nivel'],
        }
        return Response(data)


class usuariosViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().filter(is_staff=0)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('id', 'username', 'nivel')
    lookup_field = 'username'
