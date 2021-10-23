from django.shortcuts import render


def index(request):
    return render(request, 'index.html', {"name": "index"})


def corpo(request):
    return render(request, 'corpo.html', {})


def login(request):
    return render(request, 'pages/login/login.html', {})


def modulo(request):
    return render(request, 'pages/modulo/modulo.html', {})


def sala(request):
    return render(request, 'pages/sala/sala.html', {})


def andar(request):
    return render(request, 'pages/andar/andar.html', {})


def agendador(request):
    return render(request, 'pages/agendador/agendador.html', {})


def loading(request):
    return render(request, 'pages/loading/loading.html', {})


def menu(request):
    return render(request, 'pages/menu/menu.html', {})


def topo(request):
    return render(request, 'pages/topo/topo.html', {})


def controle_modulo(request):
    return render(request, 'pages/controle_modulo/controle_modulo.html', {})


def controle_andar(request):
    return render(request, 'pages/controle_andar/controle_andar.html', {})


def controle_sala(request):
    return render(request, 'pages/controle_sala/controle_sala.html', {})


def secret(request):
    return render(request, 'pages/secret/secret.html', {})
