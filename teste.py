import requests
import json


url = 'http://45.233.199.209:8000/api/alexa/'
body = {
    'user': "kalebe",
    'secret': "nada",
    'modulo': 0,
    'sala': 'sala_tv',
    'andar': 0,
    'ligar': 1,
    'desligar': 0
}
headers = {'content-type': 'application/json'}

r = requests.post(url, data=json.dumps(body), headers=headers)

print(r.text)
