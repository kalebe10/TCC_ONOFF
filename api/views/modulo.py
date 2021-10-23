from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import (Modulo, Sala, Andar, Secret, User)
from api.protocolos.modulo import Protocolo as Automacao
from api.seriallizers import ModuloSerializer
from token_jwt.authentication import JWTAuthentication
from api.services.dict2obj import obj


def enviaComando(dados=None, modulo=None):
    if not dados:
        return

    protocolo = Automacao(modulo.nome, modulo.mac, modulo.id)
    if dados.desligar:
        return protocolo.comando("&OFF")
    elif dados.ligar:
        return protocolo.comando("&ON")
    else:
        return


class Protocolo_ViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        dados = request.data
        dados = obj(dados)
        if dados.modulo:
            moduloRes = Modulo.objects.all().filter(
                id=dados.modulo).first()
            enviaComando(dados=dados, modulo=moduloRes)

        elif dados.sala:
            moduloRes = Modulo.objects.all().filter(
                sala=dados.sala, ativo=True)
            for modulo in moduloRes:
                enviaComando(dados=dados, modulo=modulo)

        elif dados.andar:
            salaRes = Sala.objects.filter(andar=dados.andar)
            for sala in salaRes:
                moduloRes = Modulo.objects.all().filter(
                    sala=sala.id, ativo=True
                )
                for modulo in moduloRes:
                    enviaComando(dados=dados, modulo=modulo)

        return Response({"mensagem": "ok"})


class Alexa_ViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer

    def create(self, request, *args, **kwargs):
        dados = request.data
        dados = obj(dados)

        if not dados.secret or not dados.user:
            return Response("Acesso não permitido. Paramentros de acessos errados.")

        user = User.objects.filter(username=dados.user).first()

        if not user:
            return Response("Acesso não permitido. Usuario não encotrado")

        secret = Secret.objects.filter(user=user.id, nome__icontains=dados.secret).first()
        if not secret:
            return Response("Acesso não permitido. Frase invalida.")

        if dados.modulo:
            moduloRes = Modulo.objects.all().filter(
                apelido__icontains=dados.modulo, user=user.id).first()
            if moduloRes:
                enviaComando(dados=dados, modulo=moduloRes)
                return Response("Comando Enviado.")
            else:
                return Response("Comando não enviado. Modulo não encontrado.")

        elif dados.sala:
            sala = Sala.objects.filter(user=user.id, nome__icontains=dados.sala).first()
            if not sala:
                return Response("Comando não enviado. Sala não encontrado.")

            moduloRes = Modulo.objects.all().filter(
                ativo=True, sala=sala.id)
            for modulo in moduloRes:
                enviaComando(dados=dados, modulo=modulo)

            return Response("Comando Enviado.")

        elif dados.andar:
            andar = Andar.objects.filter(
                nome__icontains=dados.andar, user=user.id).first()
            if not andar:
                return Response("Comando não enviado. Andar não encontrado.")
            salaRes = Sala.objects.filter(user=user.id, andar=andar.id)
            for sala in salaRes:
                moduloRes = Modulo.objects.all().filter(
                    sala=sala.id, ativo=True
                )
                for modulo in moduloRes:
                    enviaComando(dados=dados, modulo=modulo)

            return Response("Comando Enviado.")

        return Response("Comando não enviado. Condição não prevista")
