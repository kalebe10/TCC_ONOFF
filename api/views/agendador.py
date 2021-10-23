# from api.websocket import controller
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.combining import OrTrigger
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import traceback
from core.settings import DomoticaAgendamento
from api.models import (Agendador, Andar, Modulo, Sala)
from api.seriallizers import AgendadorSerializer
from token_jwt.authentication import JWTAuthentication
from api.views.modulo import enviaComando


class Agendador_Start_ViewSet(viewsets.ModelViewSet):
    queryset = Agendador.objects.all()
    serializer_class = AgendadorSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def list(self, request, *args, **kwargs):
        try:
            DomoticaAgendamento['Agendador'].shutdown(wait=True)
        except Exception:
            print("não tem agendamento ativo")
        DomoticaAgendamento['Agendador'] = BackgroundScheduler()
        start_agendador()
        for job in DomoticaAgendamento['Agendador'].get_jobs():
            print("name: %s, trigger: %s, next run: %s, handler: %s" % (
                job.name, job.trigger, job.next_run_time, job.func))
        return Response({"mensagem": "ok"})


try:
    def envia(dados, unico=False):
        if dados.modulo:
            modulos = dados.modulo.split(",")
            for modulo in modulos:
                moduloRes = Modulo.objects.all().filter(id=int(modulo)).first()
                enviaComando(dados=dados, modulo=moduloRes)
        if int(dados.sala):
            moduloRes = Modulo.objects.all().filter(
                sala=int(dados.sala), ativo=True)
            for modulo in moduloRes:
                enviaComando(dados=dados, modulo=modulo)

        if int(dados.andar):
            salaRes = Sala.objects.filter(andar=int(dados.andar))
            resposta = False
            for sala in salaRes:
                moduloRes = Modulo.objects.all().filter(
                    sala=sala.id, ativo=True
                )
                for modulo in moduloRes:
                    enviaComando(dados=dados, modulo=modulo)
            if resposta:
                Andar.objects.filter(
                    id=dados.andar).update(
                    ligar=dados.ligar,
                    desligar=dados.desligar,
                    temperatura=dados.temperatura,
                    modo=dados.modo,
                    fan=dados.fan)

        if unico:
            agendamento = Agendador.objects.filter(id=dados.id)
            agendamento.update(ativo=0)

        for job in DomoticaAgendamento['Agendador'].get_jobs():
            print("name: %s, trigger: %s, next run: %s, handler: %s" % (
                job.name, job.trigger, job.next_run_time, job.func))

    DomoticaAgendamento['Agendador'] = BackgroundScheduler()

    def start_agendador():
        agendador = Agendador.objects.all().filter(ativo=1)
        if agendador:
            for agenda in agendador:
                if agenda.tipo_acionamento == 0:
                    data = f'{agenda.data} {agenda.hora}:00'

                    trigger = OrTrigger([DateTrigger(run_date=data)])
                    DomoticaAgendamento['Agendador'].add_job(
                        envia, trigger, args=[agenda, True])

                if agenda.tipo_acionamento == 1:
                    if agenda.data_inicio != "":
                        if agenda.hora_inicio != "":
                            data_inicio = f'{agenda.data_inicio} {agenda.hora_inicio}'
                        else:
                            data_inicio = f'{agenda.data_inicio}'
                    if agenda.data_fim != "":
                        if agenda.hora_fim != "":
                            data_fim = f'{agenda.data_fim} {agenda.hora_fim}'
                        else:
                            data_fim = f'{agenda.data_fim}'

                    hora = ''
                    minuto = ''
                    if agenda.hora != "":
                        hora = str(agenda.hora).split(":")[0]
                        minuto = str(agenda.hora).split(":")[1]

                    if agenda.data_inicio and agenda.data_fim:
                        data_inicio = datetime.strptime(
                            agenda.data_inicio, '%Y-%m-%d %H:%M')
                        data_fim = datetime.strptime(
                            agenda.data_fim, '%Y-%m-%d %H:%M')
                        if agenda.hora != "":
                            trigger = OrTrigger(
                                [CronTrigger(
                                    day_of_week=agenda.dia_semana,
                                    hour=hora,
                                    minute=minuto,
                                    start_date=data_inicio,
                                    end_date=data_fim)
                                 ]
                            )
                        else:
                            trigger = OrTrigger([CronTrigger(
                                day_of_week=agenda.dia_semana,
                                start_date=data_inicio,
                                end_date=data_inicio)
                            ])
                    else:
                        if agenda.hora != "":
                            trigger = OrTrigger(
                                [CronTrigger(
                                        day_of_week=agenda.dia_semana,
                                        hour=hora,
                                        minute=minuto)])
                        else:
                            trigger = OrTrigger(
                                [CronTrigger(day_of_week=agenda.dia_semana)
                            ])

                    DomoticaAgendamento['Agendador'].add_job(envia, trigger, args=[agenda])

                if agenda.tipo_acionamento == 2:
                    if agenda.data_inicio != "":
                        if agenda.hora_inicio != "":
                            data_inicio = f'{agenda.data_inicio} {agenda.hora_inicio}'
                        else:
                            data_inicio = f'{agenda.data_inicio}'
                    if agenda.data_fim != "":
                        if agenda.hora_fim != "":
                            data_fim = f'{agenda.data_fim} {agenda.hora_fim}'
                        else:
                            data_fim = f'{agenda.data_fim}'

                    if agenda.data_inicio and agenda.data_fim:
                        data_inicio = datetime.strptime(
                            agenda.data_inicio, '%Y-%m-%d %H:%M')
                        data_fim = datetime.strptime(
                            agenda.data_fim, '%Y-%m-%d %H:%M')
                        trigger = OrTrigger(
                            [
                                IntervalTrigger(
                                    hours=agenda.hora_loop,
                                    minutes=agenda.minuto_loop,
                                    days=agenda.data_loop,
                                    seconds=0,
                                    start_date=data_inicio,
                                    end_date=data_fim)])
                    else:
                        trigger = OrTrigger([IntervalTrigger(
                            hours=agenda.hora_loop, minutes=agenda.minuto_loop, days=agenda.data_loop, seconds=0)])

                    DomoticaAgendamento['Agendador'].add_job(envia, trigger, args=[agenda])

            DomoticaAgendamento['Agendador'].start()
    # start_agendador()
except Exception as e:
    print(e)
    track = traceback.format_exc()
    print(track)
