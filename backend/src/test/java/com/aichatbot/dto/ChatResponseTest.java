package com.aichatbot.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ChatResponse DTO.
 */
class ChatResponseTest {

    @Test
    void testChatResponse_ConstructorWithAllArgs() {
        // Arrange
        String response = "Hello, user!";
        long timestamp = System.currentTimeMillis();

        // Act
        ChatResponse chatResponse = new ChatResponse(response, timestamp);

        // Assert
        assertEquals(response, chatResponse.getResponse());
        assertEquals(timestamp, chatResponse.getTimestamp());
    }

    @Test
    void testChatResponse_NoArgsConstructor() {
        // Act
        ChatResponse chatResponse = new ChatResponse();

        // Assert
        assertNotNull(chatResponse);
        assertNull(chatResponse.getResponse());
        assertEquals(0, chatResponse.getTimestamp());
    }

    @Test
    void testChatResponse_GettersAndSetters() {
        // Arrange
        ChatResponse chatResponse = new ChatResponse();
        String response = "Test response";
        long timestamp = 1234567890L;

        // Act
        chatResponse.setResponse(response);
        chatResponse.setTimestamp(timestamp);

        // Assert
        assertEquals(response, chatResponse.getResponse());
        assertEquals(timestamp, chatResponse.getTimestamp());
    }

    @Test
    void testChatResponse_ToString() {
        // Arrange
        ChatResponse chatResponse = new ChatResponse("Test", 12345L);

        // Act
        String toString = chatResponse.toString();

        // Assert
        assertNotNull(toString);
        assertTrue(toString.contains("Test"));
        assertTrue(toString.contains("12345"));
    }

    @Test
    void testChatResponse_WithNullResponse() {
        // Arrange & Act
        ChatResponse chatResponse = new ChatResponse(null, System.currentTimeMillis());

        // Assert
        assertNull(chatResponse.getResponse());
        assertTrue(chatResponse.getTimestamp() > 0);
    }

    @Test
    void testChatResponse_WithEmptyResponse() {
        // Arrange
        String emptyResponse = "";
        long timestamp = System.currentTimeMillis();

        // Act
        ChatResponse chatResponse = new ChatResponse(emptyResponse, timestamp);

        // Assert
        assertEquals(emptyResponse, chatResponse.getResponse());
        assertEquals(timestamp, chatResponse.getTimestamp());
    }

    @Test
    void testChatResponse_WithLongResponse() {
        // Arrange
        String longResponse = "a".repeat(10000);
        long timestamp = System.currentTimeMillis();

        // Act
        ChatResponse chatResponse = new ChatResponse(longResponse, timestamp);

        // Assert
        assertEquals(longResponse, chatResponse.getResponse());
        assertEquals(longResponse.length(), chatResponse.getResponse().length());
    }
}
