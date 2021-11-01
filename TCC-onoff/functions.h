boolean configSave()
{
  // Grava configuração
  StaticJsonDocument < 512 > jsonConfig;
  File file = SPIFFS.open("/Config.json", "w+");
  if (file)
  {
    jsonConfig["ssid"] = ssid;
    jsonConfig["pw"] = pw;
    jsonConfig["idModulo"] = idModulo;
    jsonConfig["usuario"] = usuario;
    serializeJsonPretty(jsonConfig, file);
    file.close();
    serializeJsonPretty(jsonConfig, Serial);
    return true;
  }
  return false;
}

void cadastraModulo() {
  if (strlen(idModulo) == 0) {
    String json;
    StaticJsonDocument<500> doc;
    doc["nome"] = WiFi.hostname();
    doc["mac"] = WiFi.macAddress();
    doc["user"] = usuario;
    serializeJson(doc, json);
    Serial.println(json);
    String ipS = ipServidor;
    String portaS = portaServidor;
    HTTPClient http;
    Serial.println("http://" + ipS + ":" + portaS + "/api/cadastraModulo/");
    http.useHTTP10(true);
    http.begin(wifiClient,"http://" + ipS + ":" + portaS +
               "/api/cadastraModulo/");
    http.addHeader("Content-Type",
                   "application/json");
    int httpCode = http.POST(json);
    StaticJsonDocument<512> response;
    DeserializationError error = deserializeJson(response, http.getStream());
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }
    char id[10];
    Serial.println(response.as<String>());
    response["id"].as<String>().toCharArray(id, 10);
    strlcpy(idModulo, id, sizeof(idModulo));
    configSave();
    http.end();
  }
}
