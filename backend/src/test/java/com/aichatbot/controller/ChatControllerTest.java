package com.aichatbot.controller;

import com.aichatbot.dto.ChatRequest;
import com.aichatbot.dto.ChatResponse;
import com.aichatbot.service.IChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for ChatController.
 * Tests REST endpoints with mocked service layer.
 */
@WebMvcTest(ChatController.class)
class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IChatService chatService;

    @Test
    void testChatEndpoint_ValidRequest_ReturnsResponse() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("Hello, chatbot!");
        String mockResponse = "Hello! How can I help you?";
        
        when(chatService.generateResponse(anyString())).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(mockResponse))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void testChatEndpoint_EmptyMessage_ReturnsBadRequest() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("");

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testChatEndpoint_NullMessage_ReturnsBadRequest() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest(null);

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testChatEndpoint_MessageTooLong_ReturnsBadRequest() throws Exception {
        // Arrange
        String longMessage = "a".repeat(5001);
        ChatRequest request = new ChatRequest(longMessage);

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testHealthEndpoint_ReturnsOk() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("AI Chatbot Backend is running!"));
    }

    @Test
    void testChatEndpoint_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        // Arrange
        ChatRequest request = new ChatRequest("Test message");
        when(chatService.generateResponse(anyString()))
                .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }
}
