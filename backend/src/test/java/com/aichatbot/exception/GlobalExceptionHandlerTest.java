package com.aichatbot.exception;

import com.aichatbot.controller.ChatController;
import com.aichatbot.dto.ChatRequest;
import com.aichatbot.service.IChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for GlobalExceptionHandler.
 * Tests exception handling across the application.
 */
@WebMvcTest(ChatController.class)
@Import(GlobalExceptionHandler.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IChatService chatService;

    @Test
    void testHandleValidationException_EmptyMessage() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("");

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void testHandleValidationException_NullMessage() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest(null);

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void testHandleValidationException_MessageTooLong() throws Exception {
        // Arrange
        String longMessage = "a".repeat(5001);
        ChatRequest request = new ChatRequest(longMessage);

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.message").exists());
    }

    @Test
    void testHandleChatException() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("Test message");
        when(chatService.generateResponse(anyString()))
                .thenThrow(new ChatException("OpenAI API error"));

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.message").value(containsString("OpenAI API error")));
    }

    @Test
    void testHandleIllegalArgumentException() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("Test message");
        when(chatService.generateResponse(anyString()))
                .thenThrow(new IllegalArgumentException("Invalid input"));

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Invalid input"));
    }

    @Test
    void testHandleGenericException() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("Test message");
        when(chatService.generateResponse(anyString()))
                .thenThrow(new RuntimeException("Unexpected error"));

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.message").value(containsString("unexpected error")));
    }

    @Test
    void testExceptionResponse_ContainsTimestamp() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("");

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.timestamp").exists());
    }
}
