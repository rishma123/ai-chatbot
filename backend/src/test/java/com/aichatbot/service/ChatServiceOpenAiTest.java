package com.aichatbot.service;

import com.aichatbot.exception.ChatException;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ChatService with OpenAI API mode.
 * Tests the OpenAI integration logic.
 */
@ExtendWith(MockitoExtension.class)
class ChatServiceOpenAiTest {

    @Mock
    private OpenAiService openAiService;

    private ChatService chatService;

    @BeforeEach
    void setUp() {
        // Initialize service in OpenAI mode (not mock mode)
        chatService = new ChatService(
                openAiService,
                "gpt-3.5-turbo",
                500,
                0.7,
                false // Use OpenAI mode
        );
    }

    @Test
    void testGenerateResponse_OpenAiMode_ReturnsApiResponse() {
        // Arrange
        String userMessage = "What is AI?";
        String expectedResponse = "AI stands for Artificial Intelligence...";
        
        ChatMessage responseMessage = new ChatMessage();
        responseMessage.setContent(expectedResponse);
        
        ChatCompletionChoice choice = new ChatCompletionChoice();
        choice.setMessage(responseMessage);
        
        ChatCompletionResult result = new ChatCompletionResult();
        result.setChoices(List.of(choice));
        
        when(openAiService.createChatCompletion(any())).thenReturn(result);

        // Act
        String response = chatService.generateResponse(userMessage);

        // Assert
        assertEquals(expectedResponse, response);
        verify(openAiService, times(1)).createChatCompletion(any());
    }

    @Test
    void testGenerateResponse_OpenAiThrowsException_ThrowsChatException() {
        // Arrange
        String userMessage = "Test message";
        when(openAiService.createChatCompletion(any()))
                .thenThrow(new RuntimeException("API error"));

        // Act & Assert
        assertThrows(ChatException.class, () -> {
            chatService.generateResponse(userMessage);
        });
    }

    @Test
    void testGenerateResponse_NullMessage_ThrowsIllegalArgumentException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            chatService.generateResponse(null);
        });
    }

    @Test
    void testGenerateResponse_EmptyMessage_ThrowsIllegalArgumentException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            chatService.generateResponse("   ");
        });
    }

    @Test
    void testGenerateResponse_OpenAiCalledWithCorrectParameters() {
        // Arrange
        String userMessage = "Hello AI";
        
        ChatMessage responseMessage = new ChatMessage();
        responseMessage.setContent("Hello!");
        
        ChatCompletionChoice choice = new ChatCompletionChoice();
        choice.setMessage(responseMessage);
        
        ChatCompletionResult result = new ChatCompletionResult();
        result.setChoices(List.of(choice));
        
        when(openAiService.createChatCompletion(any())).thenReturn(result);

        // Act
        chatService.generateResponse(userMessage);

        // Assert
        verify(openAiService).createChatCompletion(argThat(request ->
                request.getModel().equals("gpt-3.5-turbo") &&
                request.getMaxTokens().equals(500) &&
                request.getTemperature().equals(0.7) &&
                request.getMessages().size() == 1 &&
                request.getMessages().get(0).getContent().equals(userMessage)
        ));
    }
}
