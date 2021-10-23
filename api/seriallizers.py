from rest_framework.serializers import ModelSerializer
from .models import (User, Modulo, Sala, Andar, Agendador, Secret)


class ModuloSerializer(ModelSerializer):
    class Meta:
        model = Modulo
        fields = (
            'id',
            'nome',
            'ativo',
            'mac',
            'apelido',
            'user',
            'sala')


class SalaSerializer(ModelSerializer):
    class Meta:
        model = Sala
        fields = ('id', 'nome', 'ativo', 'andar', 'user')


class AndarSerializer(ModelSerializer):
    class Meta:
        model = Andar
        fields = ('id', 'nome', 'ativo', 'user')


class SecretSerializer(ModelSerializer):
    class Meta:
        model = Secret
        fields = ('id', 'nome', 'user')


class AgendadorSerializer(ModelSerializer):
    class Meta:
        model = Agendador
        fields = (
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


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'nivel')
