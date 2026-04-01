<div align="center">

# 🛰️ Space Radar API

**Real-time monitoring system for Near-Earth Objects with AI-powered collision risk classification.**

[![Java](https://img.shields.io/badge/Java-25-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-3.9+-C71A36?style=for-the-badge&logo=apachemaven)](https://maven.apache.org/)
[![NASA API](https://img.shields.io/badge/NASA-NeoWS%20API-0B3D91?style=for-the-badge&logo=nasa)](https://api.nasa.gov/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📡 Overview

**Space Radar API** is a real-time monitoring system for **Near-Earth Objects (NEOs)**. It consumes official NASA data, processes the information, and uses a **Machine Learning model** (integrated via Python/FastAPI) to classify the collision risk of asteroids — broadcasting results instantly to connected clients via WebSockets.

---

## 🚀 Core Technologies

| Technology | Purpose |
|---|---|
| **Java 25** | Latest version for maximum performance and modern syntax |
| **Spring Boot 4.0.5** | Base framework for API construction and dependency injection |
| **Spring RestClient** | Fluent, synchronous HTTP client for NASA and ML integration |
| **Jackson 3** | High-performance JSON manipulation (`tools.jackson`) |
| **WebSockets** | Bidirectional real-time communication with the Front-end |
| **Maven** | Dependency management and build automation |

---

## 🛠️ How the Radar Works

The system operates in a cyclic orchestration flow:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Data Harvesting │───▶ │  Orchestration   │───▶│  ML Inference   │───▶│    Broadcast     │
│ (NASA NeoWS)    │     │  (every 10 sec)  │     │  (FastAPI/POST) │     │  (WebSocket)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────────────────┘
```

1. **Data Harvesting** — `NasaService` consumes NASA's NeoWS API. The code is designed to be agnostic: it can fetch today's data for real-time radar or large historical volumes for AI model training.

2. **Orchestration** — Every 10 seconds, `RadarOrchestrator` fires an automatic scan (`@Scheduled`).

3. **ML Inference** — The asteroid's technical data (velocity, diameter, magnitude, distance) is sent via POST to a Python inference service.

4. **Broadcast** — After model classification, the result is instantly transmitted via WebSocket to all connected clients.

---

## 📋 Prerequisites

- ☕ **Java JDK 25** installed
- 📦 **Maven 3.9+**
- 🔑 A **NASA API Key** (obtainable at [api.nasa.gov](https://api.nasa.gov/))
- 🐍 **Python Inference Server** (FastAPI) running locally

---

## ⚙️ Configuration

Create a properties file (e.g. `external.properties`) or configure your `application.properties` with the following keys:

```properties
# NASA Credentials
nasa_api_key=YOUR_TOKEN_HERE

# Machine Learning model endpoint (FastAPI)
ml_http_url=http://127.0.0.1:8000/predict

# Server Settings
server.port=8080
```

---

## 🏃 How to Run

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/space-radar.git
cd space-radar
```

**2. Clean and build the project:**
```bash
mvn clean install
```

**3. Run the application:**
```bash
mvn spring-boot:run
```

Once running, detections can be monitored via **console logs** or through a **WebSocket client** pointed at `ws://localhost:8080`.

---

## 🏗️ Front-end Status

> [!IMPORTANT]
> **Under Development:** The visualization dashboard (Front-end) is currently being built with **Angular**.
>
> The interface will feature an interactive tactical radar, trajectory charts, and collision alerts based on data processed by this API. In the meantime, detections can be monitored via console logs or a WebSocket client.

---

## 📁 Project Structure

The project is split into two repositories that work together:

### ☕ Java API — `space-radar`
```
space-radar/
├── src/main/java/dev/umbra/space_radar_api/
│   ├── config/
│   │   ├── RestClientConfig.java         # HTTP client configuration
│   │   └── WebSocketConfig.java          # WebSocket configuration
│   ├── models/dtos/
│   │   ├── AsteroidData.java             # NASA NEO data model
│   │   └── PredictionResponse.java       # ML model response model
│   ├── schedulers/
│   │   └── RadarOrchestrator.java        # Scheduled scan (every 10s)
│   ├── services/
│   │   ├── ModelIntegrationService.java  # FastAPI integration
│   │   ├── NasaService.java              # NASA NeoWS integration
│   │   └── WebSocketService.java         # Real-time broadcast
│   └── SpaceRadarApiApplication.java     # Application entry point
├── resources/
│   └── META-INF/
│       ├── application.properties        # Main application config
│       └── env.properties                # Environment variables
├── pom.xml
└── README.md
```

### 🐍 Python ML — `py-space-radar`
```
py-space-radar/
├── data/
│   └── data.csv                          # Training dataset
├── models/
│   ├── radar_model.joblib                # Trained ML model
│   └── scaler.joblib                     # Feature scaler
└── src/
    ├── config.py                         # Server configuration
    ├── data_processor.py                 # Data preprocessing pipeline
    ├── data_sim.py                       # Data simulation utilities
    ├── main.py                           # FastAPI entry point
    └── train.py                          # Model training script
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---
