package com.aichatbot.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ChatRequest DTO validation.
 */
class ChatRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidChatRequest() {
        // Arrange
        ChatRequest request = new ChatRequest("Hello, chatbot!");

        // Act
        Set<ConstraintViolation<ChatRequest>> violations = validator.validate(request);

        // Assert
        assertTrue(violations.isEmpty());
    }

    @Test
    void testChatRequest_NullMessage_Fails() {
        // Arrange
        ChatRequest request = new ChatRequest(null);

        // Act
        Set<ConstraintViolation<ChatRequest>> violations = validator.validate(request);

        // Assert
        assertFalse(violations.isEmpty());
    }

    @Test
    void testChatRequest_EmptyMessage_Fails() {
        // Arrange
        ChatRequest request = new ChatRequest("");

        // Act
        Set<ConstraintViolation<ChatRequest>> violations = validator.validate(request);

        // Assert
        assertFalse(violations.isEmpty());
    }

    @Test
    void testChatRequest_BlankMessage_Fails() {
        // Arrange
        ChatRequest request = new ChatRequest("   ");

        // Act
        Set<ConstraintViolation<ChatRequest>> violations = validator.validate(request);

        // Assert
        assertFalse(violations.isEmpty());
    }

    @Test
    void testChatRequest_MessageTooLong_Fails() {
        // Arrange
        String longMessage = "a".repeat(5001);
        ChatRequest request = new ChatRequest(longMessage);

        // Act
        Set<ConstraintViolation<ChatRequest>> violations = validator.validate(request);

        // Assert
        assertFalse(violations.isEmpty());
    }

    @Test
    void testChatRequest_MaxLengthMessage_Passes() {
        // Arrange
        String maxMessage = "a".repeat(5000);
        ChatRequest request = new ChatRequest(maxMessage);

        // Act
        Set<ConstraintViolation<ChatRequest>> violations = validator.validate(request);

        // Assert
        assertTrue(violations.isEmpty());
    }
}
