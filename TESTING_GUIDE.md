# Testing Guide

Comprehensive testing documentation for the AI Chatbot application.

## Table of Contents
1. [Backend Tests](#backend-tests)
2. [Frontend Tests](#frontend-tests)
3. [Integration Tests](#integration-tests)
4. [Running Tests](#running-tests)
5. [Test Coverage](#test-coverage)

---

## Backend Tests

### Unit Tests

#### ChatControllerTest
Tests the REST API endpoints with mocked service layer.

**Test Cases:**
- Valid chat request returns 200 OK with response
- Empty message returns 400 Bad Request
- Null message returns 400 Bad Request
- Message exceeding 5000 characters returns 400 Bad Request
- Health endpoint returns 200 OK
- Service exception returns 500 Internal Server Error

**Run:**
```bash
cd backend
./mvnw test -Dtest=ChatControllerTest
```

#### ChatServiceTest
Tests the business logic for chat response generation.

**Test Cases:**
- Valid message returns response
- Null message throws IllegalArgumentException
- Empty/blank message throws IllegalArgumentException
- Greeting messages return appropriate greetings
- Status inquiry returns status message
- Joke request returns joke
- Goodbye messages return farewell
- Unknown messages return generic response

**Run:**
```bash
./mvnw test -Dtest=ChatServiceTest
```

#### ChatRequestTest
Tests DTO validation constraints.

**Test Cases:**
- Valid message passes validation
- Null message fails validation
- Empty message fails validation
- Blank message fails validation
- Message > 5000 characters fails validation
- Message = 5000 characters passes validation

**Run:**
```bash
./mvnw test -Dtest=ChatRequestTest
```

### Integration Tests

#### AiChatbotApplicationTests
Tests that the Spring Boot application context loads successfully.

**Run:**
```bash
./mvnw test -Dtest=AiChatbotApplicationTests
```

### Run All Backend Tests

```bash
cd backend
./mvnw test
```

### Backend Test Coverage

```bash
cd backend
./mvnw clean verify
# Coverage report: target/site/jacoco/index.html
```

---

## Frontend Tests

### Unit Tests

#### ChatService Tests
Tests HTTP communication with the backend.

**Test Cases:**
- Service is created successfully
- Send message returns response
- Empty message throws error
- Message is trimmed before sending
- HTTP 500 error is handled
- Network error is handled
- Health check endpoint works

**Run:**
```bash
cd frontend/ai-chatbot-ui
ng test --include='**/chat.service.spec.ts'
```

#### ChatComponent Tests
Tests UI component logic and user interactions.

**Test Cases:**
- Component is created successfully
- Welcome message is displayed on init
- Message is sent successfully
- Empty message is not sent
- Message is not sent while loading
- Error is displayed when sending fails
- Input is cleared after sending
- Enter key sends message
- Shift+Enter does not send message
- Error can be cleared
- Long messages are rejected
- Character count is calculated correctly
- Near limit status is detected
- Cleanup on component destroy

**Run:**
```bash
ng test --include='**/chat.component.spec.ts'
```

### Run All Frontend Tests

```bash
cd frontend/ai-chatbot-ui
ng test
```

### Frontend Test Coverage

```bash
cd frontend/ai-chatbot-ui
ng test --code-coverage
# Coverage report: coverage/index.html
```

---

## Integration Tests

### Manual Integration Testing

#### Test Backend-Frontend Integration

1. **Start Backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend/ai-chatbot-ui
   ng serve
   ```

3. **Test Cases:**
   - Open http://localhost:4200
   - Send message "Hello" → Should receive greeting
   - Send empty message → Should show validation error
   - Send very long message → Should show character limit warning
   - Stop backend → Should show connection error
   - Restart backend → Should work again

#### Test CORS

```bash
# From browser console
fetch('http://localhost:8085/api/health')
  .then(r => r.text())
  .then(console.log)
```

Should return: "AI Chatbot Backend is running!"

---

## Running Tests

### Quick Test Commands

#### Backend
```bash
# All tests
./mvnw test

# Specific test class
./mvnw test -Dtest=ChatControllerTest

# Specific test method
./mvnw test -Dtest=ChatControllerTest#testHealthEndpoint_ReturnsOk

# With coverage
./mvnw clean verify

# Skip tests (for quick build)
./mvnw clean install -DskipTests
```

#### Frontend
```bash
# All tests (headless)
ng test --browsers=ChromeHeadless --watch=false

# All tests (with browser)
ng test

# Specific test file
ng test --include='**/chat.service.spec.ts'

# With coverage
ng test --code-coverage --watch=false

# Single run (CI/CD)
ng test --watch=false --browsers=ChromeHeadless
```

### Continuous Testing

#### Backend Watch Mode
```bash
# Tests run automatically on code changes
./mvnw test -Dspring-boot.run.fork=false
```

#### Frontend Watch Mode
```bash
# Tests run automatically on code changes (default)
ng test
```

---

## Test Coverage

### Target Coverage

| Component | Target | Current |
|-----------|--------|---------|
| Controllers | 90%+ | Pass |
| Services | 85%+ | Pass |
| DTOs | 80%+ | Pass |
| Frontend Services | 85%+ | Pass |
| Frontend Components | 80%+ | Pass |
### View Coverage Reports

#### Backend
```bash
cd backend
./mvnw clean verify
# Open: target/site/jacoco/index.html
```

#### Frontend
```bash
cd frontend/ai-chatbot-ui
ng test --code-coverage --watch=false
# Open: coverage/index.html
```

---

## CI/CD Test Commands

### GitHub Actions / Jenkins

#### Backend
```yaml
- name: Run Backend Tests
  run: |
    cd backend
    ./mvnw clean verify
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./backend/target/site/jacoco/jacoco.xml
```

#### Frontend
```yaml
- name: Run Frontend Tests
  run: |
    cd frontend/ai-chatbot-ui
    npm ci
    ng test --watch=false --code-coverage --browsers=ChromeHeadless
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./frontend/ai-chatbot-ui/coverage/lcov.info
```

---

## Troubleshooting Tests

### Backend Issues

**Tests fail due to missing dependencies:**
```bash
./mvnw clean install -U
```

**Port conflicts:**
```bash
# Use random port for tests
./mvnw test -Dserver.port=0
```

**OpenAI API key issues:**
Tests use mock mode by default. Check test properties in `@TestPropertySource`.

### Frontend Issues

**Chrome not found:**
```bash
# Use headless mode
ng test --browsers=ChromeHeadless
```

**Tests timeout:**
```bash
# Increase timeout in karma.conf.js
browserNoActivityTimeout: 60000
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Best Practices

### Writing Tests

1. **Follow AAA Pattern:**
   - Arrange: Set up test data
   - Act: Execute the code under test
   - Assert: Verify the results

2. **Test Names:**
   - Use descriptive names: `testMethodName_Condition_ExpectedResult`
   - Example: `testChatEndpoint_EmptyMessage_ReturnsBadRequest`

3. **Mock External Dependencies:**
   - Mock OpenAI service
   - Mock HTTP calls
   - Use test doubles

4. **Test Edge Cases:**
   - Null values
   - Empty strings
   - Boundary conditions
   - Error scenarios

5. **Keep Tests Independent:**
   - Each test should run in isolation
   - Don't depend on test execution order
   - Clean up after tests

---

## Performance Testing

### Backend Load Testing

Use Apache JMeter or similar:

```bash
# Example with curl (basic)
for i in {1..100}; do
  curl -X POST http://localhost:8085/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"Hello"}' &
done
wait
```

### Frontend Performance

```bash
# Build for production
ng build --configuration production

# Analyze bundle size
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/ai-chatbot-ui/browser/stats.json
```

---

## Test Metrics

### Key Metrics to Track

- **Code Coverage:** % of code executed by tests
- **Test Execution Time:** How long tests take to run
- **Test Pass Rate:** % of tests passing
- **Flaky Tests:** Tests that fail intermittently
- **Bug Detection Rate:** Bugs found by tests vs production

### Generate Reports

#### Backend (JaCoCo)
```bash
./mvnw clean verify
cat target/site/jacoco/index.html
```

#### Frontend (Istanbul)
```bash
ng test --code-coverage --watch=false
cat coverage/index.html
```

---

## Next Steps

1. Run all tests to ensure they pass
2. Check coverage reports
3. Add more test cases for edge scenarios
4. Set up CI/CD pipeline with automated testing
5. Configure code coverage thresholds
6. Add E2E tests with Cypress or Playwright

For more information, see the [README.md](README.md) and [QUICK_START.md](QUICK_START.md).
