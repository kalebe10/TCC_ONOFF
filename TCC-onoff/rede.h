bool isConected() {
  // Se o Wi-Fi nao estiver conectado, retorna FALSE.
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  } else {
    return true;
  }
}

void connected() {
  wasConnected = true;
}

boolean configRead() {
  // Lê configuração
  StaticJsonDocument<512> jsonConfig;
  File file = SPIFFS.open("/Config.json", "r");
  if (deserializeJson(jsonConfig, file)) {
    return false;
  } else {
    strlcpy(ssid, jsonConfig["ssid"] | "", sizeof(ssid));
    strlcpy(pw, jsonConfig["pw"] | "", sizeof(pw));
    strlcpy(idModulo, jsonConfig["idModulo"] | "", sizeof(idModulo));
    strlcpy(usuario, jsonConfig["usuario"] | "", sizeof(usuario));
    file.close();
    serializeJsonPretty(jsonConfig, Serial);
    return true;
  }
}

void configModeCallback(WiFiManager *myWiFiManager) {
  Serial.println("Entrou no modo de configuração");
  Serial.println(WiFi.softAPIP()); // imprime o IP do AP
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

void saveConfigCallback() {
  Serial.println("Configuração salva");
  Serial.println(WiFi.softAPIP());
  Serial.println(WiFi.SSID());
  Serial.println(WiFi.psk());
  char saida[30];
  String dado = WiFi.SSID();
  dado.toCharArray(saida, 30);
  strlcpy(ssid, saida, sizeof(ssid));
  char saidas[30];
  String dados = WiFi.psk();
  dados.toCharArray(saidas, 30);
  strlcpy(pw, saidas, sizeof(pw));
  configSave();
  delay(1000);
  //  ESP.restart();
}

void verificaModo() {
  if (strlen(idModulo) == 0) {
    wifiManager.setAPCallback(configModeCallback);
    String mac = String(nomeModuloTac);
    String macR = mac;
    macR.replace(":","");
    String macS = macR.substring(6, macR.length());
    String nomeModuloForm = "<p>Modulo ESP-"+ macS + "</p>";
    const char *ModuloForm = nomeModuloForm.c_str();
    WiFiManagerParameter custom_text(ModuloForm);
    WiFiManagerParameter custom_usuario("usuario", "usuario", usuario, 20);
    if(!startConfig){
      startConfig = true;
      wifiManager.addParameter(&custom_text);
      wifiManager.addParameter(&custom_usuario);
    }
    wifiManager.setSaveConfigCallback(saveConfigCallback);

    if (strlen(ssid) == 0) {
      wifiManager.autoConnect("KAS_ONOFF", "mecatronica");
    }
    
    strcpy(usuario, custom_usuario.getValue());
    configSave();
    if (!isConected()) {
      WiFi.setAutoReconnect(true);
      WiFi.setSleepMode(WIFI_NONE_SLEEP);
      WiFi.mode(WIFI_STA);
      WiFi.begin(ssid, pw);
      WiFi.hostname();
    }
  }else{
    if (!isConected()) {
      WiFi.setAutoReconnect(true);
      WiFi.setSleepMode(WIFI_NONE_SLEEP);
      WiFi.mode(WIFI_STA);
      WiFi.begin(ssid, pw);
      WiFi.hostname();
    }
  }
}
