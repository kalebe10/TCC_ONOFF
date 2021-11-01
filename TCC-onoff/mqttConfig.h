void callbackMqtt(char *topic, byte *payload, unsigned int length) {
  Serial.print("Mensagem recebida [");
  Serial.print(topic);
  Serial.println("] ");
  String saida = "";
  for (int i = 0; i < length; i++) {
    saida += (char)payload[i];
  }
  Serial.println(saida);

  trataComando(saida);
}

void mqttClient() {
  if (strlen(idModulo) > 0) {
    Serial.println(ipMqtt);
    Serial.println(portaMqtt);
    clientMqtt.setServer(ipMqtt, portaMqtt);
    clientMqtt.setCallback(callbackMqtt);
    clientMqtt.setBufferSize(2048);
    String nomeModulo = "modulo/domotica/" + WiFi.hostname();
    const char *rotaModulo = nomeModulo.c_str();
    Serial.println(rotaModulo);
    clientMqtt.connect(rotaModulo);
    if (clientMqtt.connect(rotaModulo)) {
      clientMqtt.subscribe(rotaModulo,1);
    } else {
      if(digitalRead(pinBotaoStart) == 1){  
        Serial.println("nao conectou ao servidor mqtt");
        ESP.restart();
      }
    }
  }
}