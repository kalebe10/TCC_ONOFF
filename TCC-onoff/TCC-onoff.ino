#include <Arduino.h>
#include <ArduinoJson.h>
#include <EEPROM.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <FS.h>
#include <PubSubClient.h>
#include <WiFiManager.h>
#include <string.h>

#define MQTT_MAX_PACKET_SIZE 2048

volatile bool wasConnected = false;
volatile long wpsStateTime = 0;
const long interval = 5000;

char ipMqtt[50] = "broker.emqx.io";     // ipModulo
int portaMqtt = 1883;       // portaWs
char ipServidor[50] = "aqui ip do servidor";   // ipServidor
char portaServidor[5] = "aqui porta do servidor"; // portaServidor
char ssid[30];         // Rede WiFi
char pw[30];           // Senha da Rede WiFi
char idModulo[10];      // idModulo
char nomeModuloTac[20];
char usuario[10];
unsigned long tempo = 0;
unsigned long tempo2 = 0;
unsigned long T = 0;
bool startConfig = false;

int pinValue = 0;

#define RELAY 0 // relay connected to  GPIO0
#define ON LOW
#define OFF HIGH

#define pinBotaoStart  0
#define tempoReset     5000

// Variáveis para a leitura. Não é necessário mexer
// WebSocketsServer webSocket = WebSocketsServer(81);

WiFiManager wifiManager;
// inclui os arquivos do servidor
// void mandaDadoServidor();
WiFiClient wifiClient;
PubSubClient clientMqtt(wifiClient);


#include "functions.h"
#include "rede.h"
#include "protocolo.h"
#include "mqttConfig.h"



void setup() {
  Serial.begin(115200);
  EEPROM.begin(512);

  pinMode(RELAY,OUTPUT);
  digitalWrite(RELAY, HIGH);

  if (!SPIFFS.begin()) {
    while (true)
      ;
  }
  Serial.print("Modulo ");
  Serial.println(WiFi.macAddress());  
  strlcpy(nomeModuloTac, WiFi.macAddress().c_str(), sizeof(nomeModuloTac));
  configRead();
  configSave();
  // Define inputs e outputs
  verificaModo();
  Serial.setDebugOutput(true); 
  int z = 0;
  while (WiFi.status() != WL_CONNECTED 
  && strlen(idModulo) != 0) {
    delay(200);
    Serial.print(".");
    if(z == 50){
      break;
    }
    z++;
  }
}

void loop() {
  delay(100);   
  verificaModo();
  // Serial.print("valor do pinValue");
  // Serial.println(pinValue);

  // if(pinValue == 1) digitalWrite(GPIO_0, LOW);
  // if(pinValue == 0) digitalWrite(GPIO_0, HIGH);

  if (!isConected()) {
    Serial.println(F("Roteador nao encontrado"));
    ESP.restart();
  } else {
    connected();
    cadastraModulo();   
    static unsigned long time;
    if(strlen(ipMqtt) > 0){
      if (!clientMqtt.loop()) {
          mqttClient();
        }
    }
  }
  if (millis() < tempo || millis() < tempo2) {
    tempo = 0;
    tempo2 = 0;
  }
}
