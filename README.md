<div align="center">

# 🛰️ Space Radar

**Java/Spring API that monitors Near-Earth Objects, classifies collision risk via ML, and broadcasts alerts in real-time.**

[![Java](https://img.shields.io/badge/Java-25-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Angular](https://img.shields.io/badge/Angular-21+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![NASA API](https://img.shields.io/badge/NASA-NeoWS%20API-0B3D91?style=for-the-badge&logo=nasa)](https://api.nasa.gov/)

</div>

---

## 📡 Overview

**Space Radar** is a real-time monitoring system for **Near-Earth Objects (NEOs)**. It consumes official NASA data, processes the information, and uses a **Machine Learning model** (integrated via Python/FastAPI) to classify the collision risk of asteroids — broadcasting results instantly to an Angular dashboard via WebSockets.

---

## 🚀 Core Technologies

| Technology | Purpose |
|---|---|
| **Java 25** | Latest version for maximum performance and modern syntax |
| **Spring Boot 4.0.5** | Base framework for API construction and dependency injection |
| **WebSockets** | Bidirectional real-time communication with the front-end |
| **Python 3.10+** | ML inference service runtime |
| **FastAPI** | High-performance Python web framework for the inference endpoint |
| **scikit-learn** | Machine learning model training and prediction |
| **NeoWS API** | Official NASA data source for Near-Earth Objects |
| **Angular 21+** | Front-end dashboard with tactical radar and collision alerts |
| **SCSS** | Component styling and theming |

---

## 🛠️ How the Radar Works

The system operates in a cyclic orchestration flow:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Data Harvesting │───▶ │  Orchestration   │───▶│  ML Inference   │───▶│    Broadcast     │
│ (NASA NeoWS)    │     │  (every 10 sec)  │     │  (FastAPI/POST) │     │  (WebSocket)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────────────────┘
                                                                                    │
                                                                                    ▼
                                                                         ┌──────────────────┐
                                                                         │ Angular Dashboard│
                                                                         │  (Radar + Alerts)│
                                                                         └──────────────────┘
```

1. **Data Harvesting** — `NasaService` consumes NASA's NeoWS API. The code is designed to be agnostic: it can fetch today's data for real-time radar or large historical volumes for AI model training.

2. **Orchestration** — Every 10 seconds, `RadarOrchestrator` fires an automatic scan (`@Scheduled`).

3. **ML Inference** — The asteroid's technical data (velocity, diameter, magnitude, distance) is sent via POST to the Python inference service.

4. **Broadcast** — After model classification, the result is instantly transmitted via WebSocket to all connected clients.

5. **Dashboard** — The Angular front-end receives the data in real-time and renders it on an interactive tactical radar with collision alerts.

---

## 📋 Prerequisites

- ☕ **Java JDK 25** installed
- 📦 **Maven 3.9+**
- 🐍 **Python 3.10+**
- 🔑 A **NASA API Key** (obtainable at [api.nasa.gov](https://api.nasa.gov/))
- 🟢 **Node.js 20+** and **Angular CLI 21+**

---

## ⚙️ Configuration

Configure `src/main/resources/META-INF/env.properties` with the following keys:

```properties
# NASA Credentials
nasa_api_key=YOUR_TOKEN_HERE

# Machine Learning model endpoint (FastAPI)
ml_http_url=http://127.0.0.1:8000/predict

# Server Settings
server.port=8080
```

---

## 🏃 How to Run the Java API

**1. Clone the repository:**
```bash
git clone https://github.com/sam-umbra/space-radar.git
cd space-radar/back-end/space-radar-api
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

## 🐍 How to Run the Python ML Service

The Java API depends on the Python inference server. Start it **before** the Java application.

**1. Navigate to the Python service folder:**
```bash
cd space-radar/back-end/py-space-radar
```

**2. Install dependencies:**
```bash
pip install -r requirements.txt
# conda env update --file environment.yml --prune (if using conda)
```

**3. Run the FastAPI server:**
```bash
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

The inference endpoint will be available at `http://127.0.0.1:8000/predict`, matching the `ml_http_url` property in the Java configuration.

---

## 🌐 How to Run the Angular Front-end

**1. Navigate to the front-end folder:**
```bash
cd space-radar/front-end
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
ng serve
```

The dashboard will be available at `http://localhost:4200`. Make sure both the Java API and Python service are running before starting the front-end.

---

## 📁 Project Structure

The project lives in a single repository organized as follows:

### ☕ Java API — `back-end/space-radar-api`
```
back-end/space-radar-api/
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
└── pom.xml
```

### 🐍 Python ML — `back-end/py-space-radar`
```
back-end/py-space-radar/
├── data/
│   └── data.csv                          # Training dataset
├── models/
│   ├── radar_model.joblib                # Trained ML model (scikit-learn)
│   └── scaler.joblib                     # Feature scaler
└── src/
    ├── config.py                         # Server configuration
    ├── data_processor.py                 # Data preprocessing pipeline
    ├── data_sim.py                       # Data simulation utilities
    ├── main.py                           # FastAPI entry point
    └── train.py                          # Model training script
```

### 🌐 Angular Dashboard — `front-end`
```
front-end/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── approach-timeline/        # Asteroid approach timeline chart
│   │   │   ├── asteroid-detail/          # Asteroid detail panel
│   │   │   ├── asteroid-table/           # NEO data table
│   │   │   ├── layouts/                  # Layout components
│   │   │   │   ├── header/
│   │   │   │   ├── main/
│   │   │   │   └── footer/
│   │   │   ├── risk-chart/               # Collision risk chart
│   │   │   ├── sections/
│   │   │   │   ├── architecture-section/ # Architecture overview section
│   │   │   │   ├── features-section/     # Features section
│   │   │   │   ├── hero-section/         # Hero/landing section
│   │   │   │   ├── tech-stack/           # Tech stack section
│   │   │   │   └── threat-levels/        # Threat levels section
│   │   │   ├── star-field/               # Animated star background
│   │   │   └── stat-card/                # Statistics card
│   │   ├── helpers/
│   │   │   ├── asteroid.mapper.ts        # Data mapping utilities
│   │   │   └── reveal.directive.ts       # Scroll reveal directive
│   │   ├── models/
│   │   │   ├── asteroid.ts               # NEO data interface
│   │   │   └── prediction-response.ts    # ML prediction interface
│   │   ├── pages/
│   │   │   ├── dashboard/                # Real-time radar dashboard
│   │   │   └── landing-page/             # Landing page
│   │   ├── services/
│   │   │   └── websocket-service.ts      # WebSocket client service
│   │   ├── app.config.ts
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.scss
│   │   └── app.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```
