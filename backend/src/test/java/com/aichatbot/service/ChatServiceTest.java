package com.aichatbot.service;

import com.aichatbot.exception.ChatException;
import com.theokanning.openai.service.OpenAiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ChatService.
 * Tests business logic for chat response generation.
 */
@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private OpenAiService openAiService;

    private ChatService chatService;

    @BeforeEach
    void setUp() {
        // Initialize service in mock mode for testing
        chatService = new ChatService(
                openAiService,
                "gpt-3.5-turbo",
                500,
                0.7,
                true // Use mock mode
        );
    }

    @Test
    void testGenerateResponse_ValidMessage_ReturnsResponse() {
        // Arrange
        String userMessage = "Hello";

        // Act
        String response = chatService.generateResponse(userMessage);

        // Assert
        assertNotNull(response);
        assertFalse(response.isEmpty());
    }

    @Test
    void testGenerateResponse_NullMessage_ThrowsException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            chatService.generateResponse(null);
        });
    }

    @Test
    void testGenerateResponse_EmptyMessage_ThrowsException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            chatService.generateResponse("");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            chatService.generateResponse("   ");
        });
    }

    @Test
    void testGenerateResponse_GreetingMessage_ReturnsGreeting() {
        // Arrange
        String[] greetings = {"hello", "hi", "hey"};

        // Act & Assert
        for (String greeting : greetings) {
            String response = chatService.generateResponse(greeting);
            assertTrue(response.contains("assist") || response.contains("help"));
        }
    }

    @Test
    void testGenerateResponse_StatusMessage_ReturnsStatus() {
        // Arrange
        String message = "How are you?";

        // Act
        String response = chatService.generateResponse(message);

        // Assert
        assertTrue(response.contains("great") || response.contains("ready"));
    }

    @Test
    void testGenerateResponse_JokeMessage_ReturnsJoke() {
        // Arrange
        String message = "Tell me a joke";

        // Act
        String response = chatService.generateResponse(message);

        // Assert
        assertTrue(response.contains("programmer") || response.contains("joke"));
    }

    @Test
    void testGenerateResponse_GoodbyeMessage_ReturnsGoodbye() {
        // Arrange
        String[] goodbyes = {"bye", "goodbye"};

        // Act & Assert
        for (String goodbye : goodbyes) {
            String response = chatService.generateResponse(goodbye);
            assertTrue(response.toLowerCase().contains("goodbye") || 
                      response.toLowerCase().contains("bye"));
        }
    }

    @Test
    void testGenerateResponse_UnknownMessage_ReturnsGenericResponse() {
        // Arrange
        String message = "xyzabc123randomtext";

        // Act
        String response = chatService.generateResponse(message);

        // Assert
        assertNotNull(response);
        assertTrue(response.contains("demo mode") || response.contains("OpenAI"));
    }
}
