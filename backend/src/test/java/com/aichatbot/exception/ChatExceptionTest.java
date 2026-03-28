package com.aichatbot.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ChatException.
 */
class ChatExceptionTest {

    @Test
    void testChatException_WithMessage() {
        // Arrange
        String message = "Test error message";

        // Act
        ChatException exception = new ChatException(message);

        // Assert
        assertEquals(message, exception.getMessage());
        assertNull(exception.getCause());
    }

    @Test
    void testChatException_WithMessageAndCause() {
        // Arrange
        String message = "Test error message";
        Throwable cause = new RuntimeException("Root cause");

        // Act
        ChatException exception = new ChatException(message, cause);

        // Assert
        assertEquals(message, exception.getMessage());
        assertEquals(cause, exception.getCause());
        assertEquals("Root cause", exception.getCause().getMessage());
    }

    @Test
    void testChatException_ThrowsCorrectly() {
        // Act & Assert
        ChatException exception = assertThrows(ChatException.class, () -> {
            throw new ChatException("Error occurred");
        });

        assertEquals("Error occurred", exception.getMessage());
    }

    @Test
    void testChatException_WithNullMessage() {
        // Act
        ChatException exception = new ChatException(null);

        // Assert
        assertNull(exception.getMessage());
    }

    @Test
    void testChatException_WithNullCause() {
        // Arrange
        String message = "Test message";

        // Act
        ChatException exception = new ChatException(message, null);

        // Assert
        assertEquals(message, exception.getMessage());
        assertNull(exception.getCause());
    }
}
