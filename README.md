# AI Chatbot – Full-Stack Application

A production-ready, full-stack AI chatbot built with **Angular** (frontend) and **Spring Boot** (backend), powered by **OpenAI GPT-3.5-turbo**. Containerized with Docker and Kubernetes-ready for scalable deployment.

> Built as a personal project to demonstrate full-stack development, AI integration, and DevOps practices.

---

## Screenshot

<!-- Add your screenshot here after running the app -->
<!-- ![AI Chatbot UI](docs/images/screenshot.png) -->

> _Run the app locally and replace this section with a screenshot of the chat interface._

---

## Features

- **Real-time Chat Interface** — Responsive Angular UI with message history and dynamic states
- **OpenAI GPT-3.5-turbo** — Context-aware, intelligent responses with configurable parameters
- **Retry Logic** — Automatic retry with exponential backoff on failed requests
- **Input Validation** — Multi-layer validation with user-friendly error messages
- **Mock Mode** — Test the app without an OpenAI API key
- **Docker** — Multi-stage Docker builds for frontend and backend
- **Kubernetes** — Production-grade K8s manifests for scalable deployment
- **Health Check** — Backend health endpoint with readiness/liveness probes
- **High Test Coverage** — JUnit 5, Mockito, Jasmine, Karma, JaCoCo

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Angular 17, TypeScript, RxJS, Angular HttpClient |
| **Backend** | Java 17, Spring Boot 3.2, Maven, Lombok |
| **AI** | OpenAI GPT-3.5-turbo API |
| **Testing** | JUnit 5, Mockito, Jasmine, Karma, JaCoCo, Istanbul |
| **DevOps** | Docker, Docker Compose, Kubernetes |

---

## Quick Start

### Option 1 — Local Development

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8085`

**Frontend** (new terminal):
```bash
cd frontend/ai-chatbot-ui
npm install
ng serve
```
App runs on: `http://localhost:4200`

### Option 2 — Docker Compose (Recommended)

```bash
docker-compose up --build
```
App runs on: `http://localhost`

### Option 3 — Kubernetes

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl port-forward service/ai-chatbot-frontend-service 8080:80
```
App runs on: `http://localhost:8080`

---

## Configuration

Set your OpenAI API key as an environment variable:

```bash
# Linux/Mac
export OPENAI_API_KEY="your-api-key-here"

# Windows PowerShell
$env:OPENAI_API_KEY="your-api-key-here"
```

Or run in **mock mode** (no API key needed):
```properties
# backend/src/main/resources/application.properties
openai.use.mock.mode=true
```

---

## Running Tests

**Backend:**
```bash
cd backend
./mvnw test
./mvnw clean test jacoco:report   # with coverage report
```

**Frontend:**
```bash
cd frontend/ai-chatbot-ui
npm test
npm run test:coverage
```

See [TESTING_GUIDE.md](TESTING_GUIDE.md) and [TEST_CASES.md](TEST_CASES.md) for full details.

---

## Project Structure

```
ai-chatbot/
├── backend/                  # Spring Boot backend
│   └── src/
│       ├── main/java/        # Controllers, Services, DTOs, Exception handling
│       └── test/java/        # Unit & integration tests
├── frontend/
│   └── ai-chatbot-ui/        # Angular frontend
│       └── src/app/
│           ├── chat/         # Chat component
│           ├── services/     # HTTP service with retry logic
│           └── models/       # TypeScript interfaces
├── k8s/                      # Kubernetes manifests
├── docker-compose.yml
└── README.md
```

---

## API Reference

**Send a message:**
```
POST http://localhost:8085/api/chat
Content-Type: application/json

{ "message": "Hello!" }
```

**Health check:**
```
GET http://localhost:8085/api/health
```

---

## Author

**Rishma Merkaje Nanaiah** — Frontend-Entwicklerin | Angular & TypeScript Spezialistin

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/rishma97/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/rishma123)

---

## License

This project is created for educational and portfolio purposes.
