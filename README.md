# AI Chatbot Application

A production-ready, full-stack AI-powered chatbot application built with Spring Boot (backend) and Angular (frontend). The chatbot uses OpenAI's GPT API to provide intelligent, conversational responses.

## Features

- **Real-time Chat Interface**: Modern, responsive chat UI with message history
- **AI-Powered Responses**: Integration with OpenAI GPT-3.5-turbo model
- **RESTful API**: Well-structured backend with proper error handling and validation
- **CORS Enabled**: Secure cross-origin requests between frontend and backend
- **Health Check Endpoint**: Monitor backend service status
- **Mock Mode**: Demonstration mode with predefined responses (for testing without API key)
- **Docker Support**: Containerized deployment with Docker and Docker Compose
- **Kubernetes Ready**: Production-grade Kubernetes deployment configurations
- **Comprehensive Testing**: Unit and integration tests with high code coverage
- **Retry Logic**: Automatic retry on failed requests with exponential backoff
- **Input Validation**: Multi-layer validation with user-friendly error messages

## Tech Stack

### Backend

- **Java 17**
- **Spring Boot 3.2.3**
- **Maven** - Dependency management
- **OpenAI Java Client** - GPT API integration
- **Lombok** - Reduce boilerplate code
- **Spring Validation** - Bean validation (JSR-380)
- **SLF4J** - Logging framework

### Frontend

- **Angular 17.1.0**
- **TypeScript 5.3.2**
- **RxJS** - Reactive programming
- **Angular HttpClient** - API communication

### DevOps & Testing

- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **JUnit 5** - Backend testing
- **Mockito** - Mocking framework
- **Jasmine/Karma** - Frontend testing
- **JaCoCo** - Code coverage (Backend)
- **Istanbul** - Code coverage (Frontend)

## Prerequisites

Before running this application, ensure you have the following installed:

### For Local Development:
- **Java Development Kit (JDK) 17** or higher
- **Maven 3.6+** (or use the included Maven wrapper)
- **Node.js 18+** and **npm**
- **Angular CLI 17+**: Install globally with `npm install -g @angular/cli`
- **OpenAI API Key** (optional): Get one from [OpenAI Platform](https://platform.openai.com/)

### For Docker Deployment:
- **Docker** 20.10+
- **Docker Compose** 2.0+

### For Kubernetes Deployment:
- **kubectl** - Kubernetes CLI
- **Kubernetes cluster** (Minikube, Docker Desktop, or cloud provider)

## Deployment Options

Choose your preferred deployment method:

### Option 1: Local Development (Recommended for Development)

See [QUICK_START.md](QUICK_START.md) for detailed instructions.

**Quick Steps:**
```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend (new terminal)
cd frontend/ai-chatbot-ui
npm install
ng serve
```

Access: http://localhost:4200

### Option 2: Docker Compose (Recommended for Testing)

Run both frontend and backend with a single command:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

Access: http://localhost

**Note:** Frontend runs on port 80, backend on port 8085 in Docker.

### Option 3: Kubernetes (Recommended for Production)

Deploy to a Kubernetes cluster:

```bash
# Apply Kubernetes configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check status
kubectl get pods
kubectl get services

# Access application
kubectl port-forward service/ai-chatbot-frontend-service 8080:80
```

Access: http://localhost:8080

For detailed Kubernetes setup, see the [Kubernetes Deployment](#kubernetes-deployment) section below.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-chatbot
```

### 2. Backend Setup

#### Configure Environment Variables

Set your OpenAI API key as an environment variable:

**Windows (Command Prompt):**
```cmd
setx OPENAI_API_KEY "your-api-key-here"
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="your-api-key-here"
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="your-api-key-here"
```

#### Build and Run the Backend

```bash
cd backend

# Using Maven wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run

# Or using Maven directly
mvn clean install
mvn spring-boot:run
```

The backend server will start on **http://localhost:8085**

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend/ai-chatbot-ui

# Install dependencies
npm install

# Start the development server
ng serve
```

The Angular app will be available at **http://localhost:4200**

## Usage

1. Open your browser and navigate to `http://localhost:4200`
2. Type your message in the input field at the bottom
3. Press Enter or click the Send button
4. The AI chatbot will respond in real-time

### Sample Interactions

Try asking:
- "Hello, how are you?"
- "What's your name?"
- "Tell me a joke"
- "What can you do?"
- "Help"

---

## Docker Deployment

### Using Docker Compose

The easiest way to run the entire application:

```bash
# Start services
docker-compose up --build

# Or in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- Frontend: http://localhost (port 80)
- Backend: http://localhost:8085
- Backend Health: http://localhost:8085/api/health

### Building Individual Docker Images

#### Backend

```bash
cd backend
docker build -t ai-chatbot-backend:latest .
docker run -p 8085:8085 \
  -e OPENAI_API_KEY="your-key" \
  -e OPENAI_USE_MOCK_MODE=true \
  ai-chatbot-backend:latest
```

#### Frontend

```bash
cd frontend/ai-chatbot-ui
docker build -t ai-chatbot-frontend:latest .
docker run -p 80:80 ai-chatbot-frontend:latest
```

### Docker Environment Variables

**Backend:**
- `OPENAI_API_KEY` - Your OpenAI API key (optional in mock mode)
- `OPENAI_USE_MOCK_MODE` - Set to `true` for mock responses, `false` for real API
- `SPRING_PROFILES_ACTIVE` - Spring profile (default: `prod`)

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- kubectl configured

### Step 1: Create Secret for OpenAI API Key (Optional)

```bash
# Encode your API key
echo -n "your-api-key" | base64

# Edit k8s/secret.yaml and add the encoded value
# Then apply:
kubectl apply -f k8s/secret.yaml
```

### Step 2: Apply ConfigMap

```bash
kubectl apply -f k8s/configmap.yaml
```

### Step 3: Deploy Backend

```bash
# Build backend Docker image
cd backend
docker build -t ai-chatbot-backend:latest .

# Apply deployment
kubectl apply -f k8s/backend-deployment.yaml

# Check status
kubectl get pods -l app=ai-chatbot-backend
kubectl logs -l app=ai-chatbot-backend
```

### Step 4: Deploy Frontend

```bash
# Build frontend Docker image
cd frontend/ai-chatbot-ui
docker build -t ai-chatbot-frontend:latest .

# Apply deployment
kubectl apply -f k8s/frontend-deployment.yaml

# Check status
kubectl get pods -l app=ai-chatbot-frontend
```

### Step 5: Access the Application

```bash
# Get services
kubectl get services

# Port forward to access locally
kubectl port-forward service/ai-chatbot-frontend-service 8080:80
```

Access at: http://localhost:8080

### Kubernetes Management Commands

```bash
# View all resources
kubectl get all

# Scale backend replicas
kubectl scale deployment ai-chatbot-backend --replicas=3

# View logs
kubectl logs -f deployment/ai-chatbot-backend

# Delete all resources
kubectl delete -f k8s/
```

### Production Considerations

1. **Use proper image registry:**
   ```bash
   docker tag ai-chatbot-backend:latest your-registry/ai-chatbot-backend:v1.0
   docker push your-registry/ai-chatbot-backend:v1.0
   ```

2. **Update image references in deployment files**

3. **Set up ingress for external access:**
   ```yaml
   # k8s/ingress.yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: ai-chatbot-ingress
   spec:
     rules:
     - host: chatbot.yourdomain.com
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: ai-chatbot-frontend-service
               port:
                 number: 80
   ```

4. **Configure persistent storage for logs/data**

5. **Set up monitoring and logging**

---

## Testing

The project includes comprehensive unit and integration tests.

### Backend Tests

```bash
cd backend

# Run all tests
./mvnw test

# Run specific test
./mvnw test -Dtest=ChatControllerTest

# Generate coverage report
./mvnw clean test jacoco:report
# Report: target/site/jacoco/index.html
```

### Frontend Tests

```bash
cd frontend/ai-chatbot-ui

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
# Report: coverage/index.html

# Single run (CI/CD)
ng test --watch=false --browsers=ChromeHeadless
```

For a complete list of all test cases, see [TEST_CASES.md](TEST_CASES.md).

For detailed testing guides, see [TESTING_GUIDE.md](TESTING_GUIDE.md).

---

## API Endpoints

### Chat Endpoint
- **URL**: `POST http://localhost:8085/api/chat`
- **Request Body**:
  ```json
  {
    "message": "Hello, chatbot!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Hello! I'm your AI assistant. How can I help you today?",
    "timestamp": 1234567890123
  }
  ```

### Health Check
- **URL**: `GET http://localhost:8085/api/health`
- **Response**: `"AI Chatbot Backend is running!"`

## Project Structure

```
ai-chatbot/
├── backend/                                        # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aichatbot/
│   │   │   │   ├── AiChatbotApplication.java       # Main application entry point
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java             # CORS configuration
│   │   │   │   │   └── OpenAiConfig.java           # OpenAI service configuration
│   │   │   │   ├── controller/
│   │   │   │   │   ├── ChatController.java         # REST endpoints with validation
│   │   │   │   │   └── HomeController.java         # Health check endpoint
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ChatRequest.java            # Request model with validation
│   │   │   │   │   └── ChatResponse.java           # Response model
│   │   │   │   ├── exception/
│   │   │   │   │   ├── ChatException.java          # Custom exception
│   │   │   │   │   └── GlobalExceptionHandler.java # Centralized error handling
│   │   │   │   └── service/
│   │   │   │       ├── IChatService.java           # Service interface
│   │   │   │       └── ChatService.java            # Business logic with retry
│   │   │   └── resources/
│   │   │       └── application.properties          # Configuration file
│   │   └── test/
│   │       └── java/com/aichatbot/
│   │           ├── AiChatbotApplicationTests.java  # Spring Boot context tests
│   │           ├── controller/
│   │           │   ├── ChatControllerTest.java     # Chat API endpoint tests
│   │           │   └── HomeControllerTest.java     # Health check tests
│   │           ├── dto/
│   │           │   ├── ChatRequestTest.java        # Request validation tests
│   │           │   └── ChatResponseTest.java       # Response DTO tests
│   │           ├── exception/
│   │           │   ├── ChatExceptionTest.java      # Custom exception tests
│   │           │   └── GlobalExceptionHandlerTest.java # Error handling tests
│   │           ├── integration/
│   │           │   └── ChatIntegrationTest.java    # End-to-end integration tests
│   │           └── service/
│   │               ├── ChatServiceTest.java        # Service logic (mock mode)
│   │               └── ChatServiceOpenAiTest.java  # OpenAI API integration
│   ├── Dockerfile                                  # Multi-stage Docker build
│   ├── pom.xml                                     # Maven dependencies
│   └── mvnw / mvnw.cmd                            # Maven wrapper scripts
│
├── frontend/
│   └── ai-chatbot-ui/                             # Angular Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.component.*                # Root component
│       │   │   ├── app.component.spec.ts          # App component tests
│       │   │   ├── chat/
│       │   │   │   ├── chat.component.*           # Chat UI with memory mgmt
│       │   │   │   ├── chat.component.spec.ts     # Component core tests
│       │   │   │   └── chat.component.extended.spec.ts # Component extended tests
│       │   │   ├── core/
│       │   │   │   └── constants/
│       │   │   │       ├── app.constants.ts       # Application constants
│       │   │   │       └── app.constants.spec.ts  # Constants validation tests
│       │   │   ├── models/
│       │   │   │   ├── chat.model.ts              # TypeScript interfaces
│       │   │   │   └── chat.model.spec.ts         # Model validation tests
│       │   │   └── services/
│       │   │       ├── chat.service.ts            # HTTP service with retry
│       │   │       ├── chat.service.spec.ts       # Service core tests
│       │   │       └── chat.service.extended.spec.ts # Service extended tests
│       │   ├── environments/
│       │   │   ├── environment.ts                 # Production environment
│       │   │   └── environment.development.ts     # Development environment
│       │   ├── index.html                         # Main HTML file
│       │   └── styles.css                         # Global styles
│       ├── Dockerfile                             # Multi-stage Docker build
│       ├── nginx.conf                             # Nginx configuration
│       ├── angular.json                           # Angular configuration
│       ├── package.json                           # npm dependencies
│       └── tsconfig.json                          # TypeScript configuration
│
├── k8s/                                           # Kubernetes Manifests
│   ├── backend-deployment.yaml                    # Backend deployment & service
│   ├── frontend-deployment.yaml                   # Frontend deployment & service
│   ├── configmap.yaml                             # Application configuration
│   └── secret.yaml                                # Sensitive data (API keys)
│
├── docker-compose.yml                             # Docker Compose orchestration
├── README.md                                      # This file
├── QUICK_START.md                                 # Quick start guide
├── TESTING_GUIDE.md                               # Testing documentation
├── TEST_CASES.md                                  # Comprehensive test case listing
└── IMPLEMENTATION_COMPLETE.md                     # Implementation details
```

## Configuration

### Backend Configuration

#### Local Development

Edit [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties):

```properties
# Server Configuration
server.port=8085

# OpenAI Configuration
openai.api.key=${OPENAI_API_KEY}     # From environment variable
openai.model=gpt-3.5-turbo            # GPT model to use
openai.max.tokens=500                  # Maximum response length
openai.temperature=0.7                 # Creativity (0.0-1.0)
openai.use.mock.mode=true              # true = mock responses, false = real API

# CORS Configuration (handled by CorsConfig.java)
# Allows http://localhost:4200 and http://localhost
```

#### Docker Environment Variables

When running with Docker or Docker Compose:

```yaml
environment:
  - OPENAI_API_KEY=your-api-key-here
  - OPENAI_USE_MOCK_MODE=true          # Set to false for production
  - SPRING_PROFILES_ACTIVE=prod
```

#### Kubernetes ConfigMap & Secret

**ConfigMap** ([k8s/configmap.yaml](k8s/configmap.yaml)):
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ai-chatbot-config
data:
  OPENAI_MODEL: "gpt-3.5-turbo"
  OPENAI_USE_MOCK_MODE: "true"
  OPENAI_MAX_TOKENS: "500"
  OPENAI_TEMPERATURE: "0.7"
```

**Secret** ([k8s/secret.yaml](k8s/secret.yaml)):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ai-chatbot-secret
type: Opaque
data:
  OPENAI_API_KEY: "<base64-encoded-api-key>"
```

### Frontend Configuration

#### Environment Files

**Development** ([src/environments/environment.development.ts](frontend/ai-chatbot-ui/src/environments/environment.development.ts)):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8085/api'
};
```

**Production** ([src/environments/environment.ts](frontend/ai-chatbot-ui/src/environments/environment.ts)):
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8085/api'  // Update for production domain
};
```

#### Application Constants

[src/app/core/constants/app.constants.ts](frontend/ai-chatbot-ui/src/app/core/constants/app.constants.ts):
```typescript
export const APP_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 5000,
  MIN_MESSAGE_LENGTH: 1,
  REQUEST_TIMEOUT: 30000,        // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000              // 1 second
};
```

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use:**
```
Change server.port in application.properties to a different port
```

**OpenAI API Key Not Found:**
```
Ensure OPENAI_API_KEY environment variable is set
Restart your terminal/IDE after setting the variable
```

**Build Failures:**
```bash
# Clean Maven cache and rebuild
./mvnw clean
./mvnw install -U
```

### Frontend Issues

**Cannot find module '@angular/...':**
```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS Errors:**
```
Verify backend is running on port 8085
Check ChatController.java has @CrossOrigin annotation
```

## Current Status

✅ **Production Ready** - The application includes:

- **Code Quality**: SOLID principles, interface-based design, global exception handling
- **Validation**: Bean validation with custom error messages
- **Resilience**: Retry logic with exponential backoff, timeout handling
- **Testing**: Comprehensive unit and integration tests with high coverage
- **Containerization**: Multi-stage Docker builds optimized for production
- **Orchestration**: Docker Compose for local development, Kubernetes manifests for production
- **Monitoring**: Health check endpoints, readiness/liveness probes

### Operating Modes

1. **Mock Mode** (`openai.use.mock.mode=true`): Returns predefined responses without API calls
2. **Production Mode** (`openai.use.mock.mode=false`): Uses OpenAI GPT API for intelligent responses (requires valid API key with billing enabled)

## Future Enhancements

### Application Features
- [ ] Conversation history persistence (PostgreSQL/MongoDB integration)
- [ ] User authentication and sessions (Spring Security + JWT)
- [ ] Multiple chat conversations with context switching
- [ ] File upload and analysis capabilities
- [ ] Streaming responses for real-time output (SSE/WebSocket)
- [ ] Dark mode theme toggle
- [ ] Export chat history (PDF/JSON)
- [ ] Custom system prompts and persona configuration
- [ ] Multi-language support (i18n)

### DevOps & Infrastructure
- [ ] CI/CD pipeline (GitHub Actions/Jenkins)
- [ ] Automated deployment to cloud (AWS EKS, Azure AKS, GKE)
- [ ] Application monitoring (Prometheus + Grafana)
- [ ] Centralized logging (ELK Stack or Loki)
- [ ] Distributed tracing (Jaeger/Zipkin)
- [ ] Rate limiting and API throttling (Redis)
- [ ] Auto-scaling policies (HPA in Kubernetes)
- [ ] Backup and disaster recovery
- [ ] Security scanning (OWASP, Snyk, Trivy)

### Performance & Reliability
- [ ] Response caching (Redis)
- [ ] Database connection pooling optimization
- [ ] CDN integration for frontend assets
- [ ] Load balancing and circuit breakers
- [ ] Message queue for async processing (RabbitMQ/Kafka)

## 📝 License

This project is created for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

**Note**: Remember to keep your OpenAI API key secure and never commit it to version control!
