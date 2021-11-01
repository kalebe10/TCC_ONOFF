# KAS ONOFF

O presente repositório e referente ao trabalho de conclusão de curso do aluno Kalebe A. Silva

## Requisitos

ESP01
Python 3.7
 
## Instalação

Após realizar o download do diretório e o python instalado realizar os seguintes passos:

```bash
pip install -r requirements.txt
```
```bash
python manage.py migrate
```
```bash
python manage.py createsuperuser
```
Para o carregamento do código no ESP01 foi utilizado a ide do arduino e a placa GenericESP8266
o codigo do projeto se encontra em [TCC_ONOFF](https://github.com/kalebe10/TCC_ONOFF/tree/main/TCC-onoff)

## Iniciando o projeto

Para o funcionamento deverá rodar o servidor para acesso externo com a porta 8000, a porta fica a escolha.

```bash
python manage.py runserver 0.0.0.0:8000
```