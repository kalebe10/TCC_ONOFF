import paho.mqtt.publish as publish


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

    def comando(self, comando):
        check = self.checkSum(comando)
        msg = f"""{comando}{check}"""
        rota = f"modulo/domotica/{self.nome}"
        print(rota)
        publish.single(rota, payload=msg, hostname="broker.emqx.io", port=1883)

        return msg
