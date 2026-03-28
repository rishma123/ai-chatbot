# Quick Start Guide

This guide will help you quickly get the AI Chatbot application up and running using your preferred deployment method.

## Prerequisites

Choose the prerequisites based on your deployment method:

### Option 1: Local Development
- Java 17 or higher: `java -version`
- Maven (or use included wrapper): `mvn -version`
- Node.js 18+: `node -version`
- npm: `npm -version`
- Angular CLI: `ng version` (install with `npm install -g @angular/cli`)

### Option 2: Docker Deployment
- Docker: `docker --version`
- Docker Compose: `docker-compose --version`

### Option 3: Kubernetes Deployment
- Docker (for building images): `docker --version`
- kubectl: `kubectl version`
- Running Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)

---

## Quick Start Options

### Option 1: Local Development Setup

**Step 1: Start the Backend (Port 8085)**

```bash
# Navigate to backend directory
cd backend

# Clean and build
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

**Backend available at:** http://localhost:8085  
**Health check:** http://localhost:8085/api/health

**Step 2: Start the Frontend (Port 4200)**

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend/ai-chatbot-ui

# Install dependencies (first time only)
npm install

# Start development server
ng serve
```

**Frontend available at:** http://localhost:4200

---

### Option 2: Docker Compose (Recommended for Quick Testing)

This is the fastest way to run the complete application:

```bash
# From the project root directory
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

**Access the application:**
- Frontend: http://localhost (port 80)
- Backend: http://localhost:8085
- Health check: http://localhost:8085/api/health

**Stop the application:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

---

### Option 3: Kubernetes Deployment

**Step 1: Build Docker Images**

```bash
# Build backend
cd backend
docker build -t ai-chatbot-backend:latest .

# Build frontend
cd ../frontend/ai-chatbot-ui
docker build -t ai-chatbot-frontend:latest .
cd ../..
```

**Step 2: Apply Kubernetes Manifests**

```bash
# Apply ConfigMap and Secret
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Deploy backend and frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check deployment status
kubectl get all
```

**Step 3: Access the Application**

```bash
# Port forward to access locally
kubectl port-forward service/ai-chatbot-frontend-service 8080:80
```

**Access at:** http://localhost:8080

---

## Testing the Application

1. Open your browser to the appropriate URL (based on your deployment method)
2. Type a message in the input field
3. Press Enter or click Send

### Sample Messages to Try
- "Hello, how are you?"
- "What's your name?"
- "Tell me a joke"
- "What can you do?"
- "Help"

---

## Configuration

### Using Mock Mode (Default)

By default, the application runs in **mock mode** and returns predefined responses without calling the OpenAI API.

### Switch to Real OpenAI API

#### For Local Development

1. **Set your API key:**
   ```bash
   # Windows PowerShell
   $env:OPENAI_API_KEY="sk-your-key-here"
   
   # Linux/Mac
   export OPENAI_API_KEY="sk-your-key-here"
   ```

2. **Edit `backend/src/main/resources/application.properties`:**
   ```properties
   openai.use.mock.mode=false
   ```

3. **Restart the backend**

#### For Docker Compose

Edit [docker-compose.yml](docker-compose.yml):
```yaml
backend:
  environment:
    - OPENAI_API_KEY=sk-your-key-here
    - OPENAI_USE_MOCK_MODE=false
```

#### For Kubernetes

1. Encode your API key:
   ```bash
   echo -n "sk-your-key-here" | base64
   ```

2. Edit [k8s/secret.yaml](k8s/secret.yaml) and add the encoded value

3. Edit [k8s/configmap.yaml](k8s/configmap.yaml):
   ```yaml
   data:
     OPENAI_USE_MOCK_MODE: "false"
   ```

4. Apply changes:
   ```bash
   kubectl apply -f k8s/secret.yaml
   kubectl apply -f k8s/configmap.yaml
   kubectl rollout restart deployment/ai-chatbot-backend
   ```

---

## Troubleshooting

### Backend won't start - Port Already in Use

**Solution:** Change the port in `application.properties` or stop the process using port 8085:

```bash
# Windows
netstat -ano | findstr :8085
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8085 | xargs kill -9
```

### Frontend can't connect to backend - CORS Error

**Check:**
1. Backend is running and accessible
2. CORS configuration allows your origin
3. Environment configuration points to correct backend URL

### Docker Compose Issues

**Container fails to start:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Kubernetes Pod Not Running

```bash
# Check pod status
kubectl get pods

# View pod logs
kubectl logs <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>

# Common issue: Image pull error
# Make sure images are built and tagged correctly
```

### OpenAI API Key Issues

**Error: API key not found**
- Verify environment variable is set correctly
- Restart the application after setting the key
- For K8s, ensure Secret is properly encoded and applied

**Error: API key invalid**
- Check your OpenAI account has an active API key
- Verify billing is enabled on your OpenAI account

---

## Running Tests

### Backend Tests

```bash
cd backend
./mvnw test

# With coverage report
./mvnw clean verify
# View report: target/site/jacoco/index.html
```

### Frontend Tests

```bash
cd frontend/ai-chatbot-ui
ng test

# With coverage
ng test --code-coverage
# View report: coverage/index.html
```

For detailed testing information, see [TESTING_GUIDE.md](TESTING_GUIDE.md).

---

## Development Tips

### Hot Reload

Both backend and frontend support hot reload during development:

- **Backend:** Spring Boot DevTools automatically reloads on changes
- **Frontend:** Angular CLI watches for changes and rebuilds

### View Logs

**Local Development:**
- Backend: Check the terminal where you ran `mvnw spring-boot:run`
- Frontend: Open browser DevTools (F12) → Console tab

**Docker Compose:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Kubernetes:**
```bash
kubectl logs -f deployment/ai-chatbot-backend
kubectl logs -f deployment/ai-chatbot-frontend
```

### Clear Cache

If things seem broken:

**Backend:**
```bash
./mvnw clean
```

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Docker:**
```bash
docker-compose down -v
docker system prune -a
```

---

## API Endpoints Reference

### Chat Endpoint
```http
POST http://localhost:8085/api/chat
Content-Type: application/json

{
  "message": "Your message here"
}

Response:
{
  "response": "AI response",
  "timestamp": 1234567890123
}
```

### Health Check
```http
GET http://localhost:8085/api/health

Response:
"AI Chatbot Backend is running!"
```

---

## Next Steps

1. ✅ Review [README.md](README.md) for comprehensive documentation
2. ✅ Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for testing details
3. ✅ Try different chat messages to test the chatbot
4. ✅ Configure your OpenAI API key for real AI responses
5. ✅ Explore the code to understand the architecture

---

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Review error messages in logs
- Check browser console for frontend issues (F12)
- Check terminal/container logs for backend issues
- Ensure all prerequisites are correctly installed

---

**Happy Coding!**
