import paho.mqtt.client as paho
# import paho.mqtt.publish as publish
from datetime import datetime

class Protocolo():

    def __init__(self, nome, mac, id, fila=False):
        self.nome = nome
        self.mac = mac
        self.id = id
        self.fila = fila

    def checkSum(self, comando):
        soma = 0
        comando = comando.replace("(", '').replace(")", '')
        for a in comando:
            soma += ord(a)

        saida = hex(soma)[-2::]
        return saida

    def on_publish(self, client, userdata, result):
        print("entrou")
        pass

    def comando(self, comando):
        check = self.checkSum(comando)
        msg = f"""{comando}{check}"""
        rota = f"modulo/domotica/{self.nome}"
        broker = "broker.emqx.io"
        port = 1883
        client1 = paho.Client("control1")
        client1.on_publish = self.on_publish
        client1.connect(broker, port)
        ret = client1.publish(rota, msg)
        print(f"enviado em {datetime.now()}")
        return msg
