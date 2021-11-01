bool verificaComando(String comando) {
  int valor = 0;
  String check = "";
  String checkComando = "";
  for (int i = 0; i < comando.length(); i++) {
    if (i < comando.length() - 2) {
      valor += (byte)comando[i];
    } else {
      check += comando[i];
    }
  }
  for (int i = 0; i < String(valor, HEX).length(); i++) {
    if (i == String(valor, HEX).length() - 2) {
      checkComando += String(valor, HEX)[i];
    }
    if (i == String(valor, HEX).length() - 1) {
      checkComando += String(valor, HEX)[i];
    }
  }
  Serial.println("verificando");
  Serial.println(check);
  Serial.println(checkComando);
  if (check == checkComando) {
    return true;
  } else {
    return false;
  }
}

String checkSum(String comando) {
  int valor = 0;
  for (int i = 0; i < comando.length(); i++) {
    valor += comando[i] + 0;
  }
  String saida = String(valor, HEX);
  saida = saida.substring((saida.length() - 2), saida.length());
  return comando + saida;
}
void trataComando(String comando, int corte = 2) {
  String parametro = comando.substring(1, (comando.length() - corte));
  Serial.println(parametro.indexOf('#'));
  int delimitador = parametro.indexOf('#');
  String funcao;
  if (delimitador == -1) {
    funcao = parametro;
  } else {
    funcao = parametro.substring(0, delimitador);
  }
  Serial.println(funcao);
  if (funcao == "REDE") {
    String check = checkSum("OK" + WiFi.macAddress());
  }  
  // ssid da rede
  else if (funcao == "SSID") {
    String dado = parametro.substring(delimitador + 1, parametro.length());
    Serial.print("ssid recebido = ");
    Serial.println(dado);
    char saida[30];
    dado.toCharArray(saida, 30);
    strlcpy(ssid, saida, sizeof(ssid));
    if (configSave()) {
      String check = checkSum("SSID");

    } else {
      String check = checkSum("SSID!ERROR");
    }
  } else if (funcao == "LSSID") {
    String saida = ssid;
    String check = checkSum("LSSID#" + saida);
  }
  // senha da rede
  else if (funcao == "PSW") {
    String dado = parametro.substring(delimitador + 1, parametro.length());
    Serial.print("senha rede recebido = ");
    Serial.println(dado);
    char saida[30];
    dado.toCharArray(saida, 30);
    strlcpy(pw, saida, sizeof(pw));
    if (configSave()) {
      String check = checkSum("PSW");

    } else {
      String check = checkSum("PSW!ERROR");
    }
  } else if (funcao == "PSW") {
    String saida = pw;
    String check = checkSum("PSW#" + saida);
  }
  // ID do modulo
  else if (funcao == "IDMD") {
    String dado = parametro.substring(delimitador + 1, parametro.length());
    Serial.print("id modulo recebido = ");
    Serial.println(dado);
    char saida[10];
    dado.toCharArray(saida, 10);
    strlcpy(idModulo, saida, sizeof(idModulo));
    if (configSave()) {
      String check = checkSum("IDMD");

    } else {
      String check = checkSum("IDMD!ERROR");
    }
  } else if (funcao == "IDMD") {
    String saida = idModulo;
  }
  else if (funcao == "ON") {
    Serial.print("Mudando Status Relé ");
    pinValue = 1;
    digitalWrite(RELAY,LOW);
  }
  else if (funcao == "OFF") {
    Serial.print("Mudando Status Relé ");
    pinValue = 0;
    digitalWrite(RELAY,HIGH);
  }
  // reinicia o modulo ESP.restart();
  else if (funcao == "RST") {
    String check = checkSum("RST");
    delay(1000);
    ESP.restart();
  }
}