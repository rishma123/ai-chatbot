package com.aichatbot.integration;

import com.aichatbot.dto.ChatRequest;
import com.aichatbot.dto.ChatResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for the entire chat flow.
 * Tests the application end-to-end with real Spring context.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "openai.api.key=test-key",
    "openai.use-mock-mode=true"
})
class ChatIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getBaseUrl() {
        return "http://localhost:" + port;
    }

    @Test
    void testChatEndToEnd_ValidRequest_ReturnsResponse() {
        // Arrange
        ChatRequest request = new ChatRequest("Hello");
        String url = getBaseUrl() + "/api/chat";

        // Act
        ResponseEntity<ChatResponse> response = restTemplate.postForEntity(
                url, request, ChatResponse.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getResponse());
        assertFalse(response.getBody().getResponse().isEmpty());
        assertTrue(response.getBody().getTimestamp() > 0);
    }

    @Test
    void testChatEndToEnd_GreetingMessage_ReturnsGreeting() {
        // Arrange
        ChatRequest request = new ChatRequest("Hi there!");
        String url = getBaseUrl() + "/api/chat";

        // Act
        ResponseEntity<ChatResponse> response = restTemplate.postForEntity(
                url, request, ChatResponse.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        String botResponse = response.getBody().getResponse();
        assertTrue(botResponse.contains("assist") || botResponse.contains("help"));
    }

    @Test
    void testChatEndToEnd_JokeRequest_ReturnsJoke() {
        // Arrange
        ChatRequest request = new ChatRequest("Tell me a joke");
        String url = getBaseUrl() + "/api/chat";

        // Act
        ResponseEntity<ChatResponse> response = restTemplate.postForEntity(
                url, request, ChatResponse.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().getResponse().isEmpty());
    }

    @Test
    void testChatEndToEnd_EmptyMessage_ReturnsBadRequest() {
        // Arrange
        ChatRequest request = new ChatRequest("");
        String url = getBaseUrl() + "/api/chat";

        // Act
        ResponseEntity<String> response = restTemplate.postForEntity(
                url, request, String.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testHealthEndpoint_ReturnsHealthy() {
        // Arrange
        String url = getBaseUrl() + "/api/health";

        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("running"));
    }

    @Test
    void testHomeEndpoint_ReturnsWelcome() {
        // Arrange
        String url = getBaseUrl() + "/";

        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Welcome"));
    }

    @Test
    void testMultipleRequests_AllSucceed() {
        // Arrange
        String url = getBaseUrl() + "/api/chat";
        String[] messages = {"Hello", "How are you?", "Tell me a joke", "Goodbye"};

        // Act & Assert
        for (String message : messages) {
            ChatRequest request = new ChatRequest(message);
            ResponseEntity<ChatResponse> response = restTemplate.postForEntity(
                    url, request, ChatResponse.class);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().getResponse());
        }
    }
}
