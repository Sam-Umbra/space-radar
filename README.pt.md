<div align="center">

# 🛰️ Space Radar

**Sistema de monitoramento em tempo real de Objetos Próximos à Terra com classificação de risco por Inteligência Artificial.**

[![Java](https://img.shields.io/badge/Java-25-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-3.9+-C71A36?style=for-the-badge&logo=apachemaven)](https://maven.apache.org/)
[![NASA API](https://img.shields.io/badge/NASA-NeoWS%20API-0B3D91?style=for-the-badge&logo=nasa)](https://api.nasa.gov/)
[![License](https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📡 Visão Geral

O **Space Radar API** é um sistema de monitoramento em tempo real para **Objetos Próximos à Terra (NEOs — Near-Earth Objects)**. O projeto consome dados oficiais da NASA, processa as informações e utiliza um **modelo de Machine Learning** (integrado via Python/FastAPI) para classificar o risco de colisão de asteroides — transmitindo os resultados instantaneamente para clientes conectados via WebSockets.

---

## 🚀 Tecnologias Core

| Tecnologia | Finalidade |
|---|---|
| **Java 25** | Versão mais recente para máxima performance e sintaxe moderna |
| **Spring Boot 4.0.5** | Framework base para a construção da API e injeção de dependências |
| **Spring RestClient** | Cliente HTTP fluente e síncrono para integração com NASA e ML |
| **Jackson 3** | Manipulação de JSON de alto desempenho (`tools.jackson`) |
| **WebSockets** | Comunicação bidirecional em tempo real com o Front-end |
| **Maven** | Gerenciamento de dependências e automação de build |

---

## 🛠️ Como o Radar Funciona?

O sistema opera em um fluxo cíclico de orquestração:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Coleta de Dados  │───▶│  Orquestração    │────▶│  Inferência ML   │───▶│    Broadcast     │
│ (NASA NeoWS)     │     │  (a cada 10 seg) │     │  (FastAPI/POST)  │     │  (WebSocket)     │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

1. **Data Harvesting** — O `NasaService` consome a API NeoWS da NASA. O código foi projetado para ser agnóstico: ele pode buscar o dado do dia atual para o radar em tempo real ou grandes volumes históricos para treinamento de modelos de IA.

2. **Orchestration** — A cada 10 segundos, o `RadarOrchestrator` dispara uma varredura automática (`@Scheduled`).

3. **ML Inference** — Os dados técnicos do asteroide (velocidade, diâmetro, magnitude, distância) são enviados via POST para um serviço de inferência em Python.

4. **Broadcast** — Após a classificação do modelo, o resultado é transmitido instantaneamente via WebSocket para todos os clientes conectados.

---

## 📋 Pré-requisitos

- ☕ **Java JDK 25** instalado
- 📦 **Maven 3.9+**
- 🔑 Uma **NASA API Key** (pode ser obtida em [api.nasa.gov](https://api.nasa.gov/))
- 🐍 **Servidor de Inferência Python** (FastAPI) rodando localmente

---

## ⚙️ Configuração

Crie um arquivo de propriedades (ex: `external.properties`) ou configure o seu `application.properties` com as seguintes chaves:

```properties
# Credenciais da NASA
nasa_api_key=SEU_TOKEN_AQUI

# Endpoint do modelo de Machine Learning (FastAPI)
ml_http_url=http://127.0.0.1:8000/predict

# Configurações do Servidor
server.port=8080
```

---
 
## 🏃 Como Rodar
 
**1. Clonar o repositório:**
```bash
git clone https://github.com/sam-umbra/space-radar.git
cd space-radar/space-radar-api
```
 
**2. Limpar e compilar o projeto:**
```bash
mvn clean install
```
 
**3. Executar a aplicação:**
```bash
mvn spring-boot:run
```
 
Com a aplicação rodando, as detecções podem ser acompanhadas via **logs do console** ou através de um **cliente WebSocket** apontado para `ws://localhost:8080`.
 
---
 
## 🐍 Como Rodar o Serviço Python ML
 
A API Java depende do servidor de inferência Python. Inicie-o **antes** da aplicação Java.
 
**1. Clonar o repositório:**
```bash
git clone https://github.com/sam-umbra/space-radar.git
cd space-radar/py-space-radar
```
 
**2. Instalar as dependências:**
```bash
pip install -r requirements.txt
# conda env update --file environment.yml --prune (Se você estiver usando Conda)
```
 
**3. Executar o servidor FastAPI:**
```bash
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```
 
O endpoint de inferência estará disponível em `http://127.0.0.1:8000/predict`, correspondendo à propriedade `ml_http_url` na configuração Java.
 
---

## 🏗️ Status do Front-end

> [!IMPORTANT]
> **Em Desenvolvimento:** Atualmente, o painel de visualização (Front-end) está sendo desenvolvido utilizando **Angular**.
>
> A interface contará com um radar tático interativo, gráficos de trajetória e alertas de colisão baseados nos dados processados por esta API. Por enquanto, as detecções podem ser acompanhadas via logs do console ou através de um cliente WebSocket.

---

## 📁 Estrutura do Projeto

O projeto é dividido em dois repositórios que trabalham juntos:

### ☕ Java API — `space-radar`
```
space-radar/
├── src/main/java/dev/umbra/space_radar_api/
│   ├── config/
│   │   ├── RestClientConfig.java         # Configuração do cliente HTTP
│   │   └── WebSocketConfig.java          # Configuração do WebSocket
│   ├── models/dtos/
│   │   ├── AsteroidData.java             # Modelo de dados NEO da NASA
│   │   └── PredictionResponse.java       # Modelo de resposta do ML
│   ├── schedulers/
│   │   └── RadarOrchestrator.java        # Varredura agendada (a cada 10s)
│   ├── services/
│   │   ├── ModelIntegrationService.java  # Integração com FastAPI
│   │   ├── NasaService.java              # Integração com NASA NeoWS
│   │   └── WebSocketService.java         # Broadcast em tempo real
│   └── SpaceRadarApiApplication.java     # Ponto de entrada da aplicação
├── resources/
│   └── META-INF/
│       ├── application.properties        # Configuração principal da aplicação
│       └── env.properties                # Variáveis de ambiente
├── pom.xml
└── README.md
```

### 🐍 Python ML — `py-space-radar`
```
py-space-radar/
├── data/
│   └── data.csv                          # Dataset de treinamento
├── models/
│   ├── radar_model.joblib                # Modelo ML treinado
│   └── scaler.joblib                     # Scaler de features
└── src/
    ├── config.py                         # Configuração do servidor
    ├── data_processor.py                 # Pipeline de pré-processamento
    ├── data_sim.py                       # Utilitários de simulação de dados
    ├── main.py                           # Ponto de entrada FastAPI
    └── train.py                          # Script de treinamento do modelo
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---
