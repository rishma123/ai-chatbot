package com.aichatbot.service;

import com.aichatbot.exception.ChatException;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Service implementation that handles chat operations.
 * Integrates with OpenAI API to generate intelligent responses.
 * Falls back to mock responses if API is unavailable.
 */
@Service
public class ChatService implements IChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    
    // Keywords for mock response matching
    private static final String KEYWORD_WEATHER = "weather";
    private static final String KEYWORD_GOODBYE = "goodbye";
    private static final String KEYWORD_BYE = "bye";
    
    private final OpenAiService openAiService;
    private final String model;
    private final Integer maxTokens;
    private final Double temperature;
    private final boolean useMockMode;

    // Mock response mappings for demo mode
    private static final Map<String, String> MOCK_RESPONSES = Map.ofEntries(
        Map.entry("greeting", "Hello! I'm your AI assistant. How can I help you today?"),
        Map.entry("status", "I'm doing great, thank you for asking! I'm here and ready to help you with any questions you have."),
        Map.entry("name", "I'm an AI chatbot built with Spring Boot and Angular. You can call me ChatBot!"),
        Map.entry(KEYWORD_WEATHER, "I don't have real-time weather data access yet, but I'd be happy to help you with other questions!"),
        Map.entry("joke", "Why do programmers prefer dark mode? Because light attracts bugs! 😄"),
        Map.entry("help", "I'm here to assist you! You can ask me questions, have a conversation, or just chat. What would you like to know?"),
        Map.entry("thanks", "You're very welcome! I'm always happy to help. Is there anything else you'd like to know?"),
        Map.entry(KEYWORD_GOODBYE, "Goodbye! It was nice chatting with you. Come back anytime!"),
        Map.entry("capabilities", "I'm an AI chatbot that can answer questions, have conversations, and help with various topics. Once connected to OpenAI, I'll have even more capabilities!")
    );

    /**
     * Constructor with dependency injection.
     * 
     * @param openAiService Injected OpenAI service
     * @param model GPT model to use
     * @param maxTokens Maximum tokens in response
     * @param temperature Creativity level (0.0-1.0)
     * @param useMockMode Whether to use mock responses instead of API calls
     */
    public ChatService(
            OpenAiService openAiService,
            @Value("${openai.model}") String model,
            @Value("${openai.max.tokens}") Integer maxTokens,
            @Value("${openai.temperature}") Double temperature,
            @Value("${openai.use-mock-mode:true}") boolean useMockMode) {
        
        this.openAiService = openAiService;
        this.model = model;
        this.maxTokens = maxTokens;
        this.temperature = temperature;
        this.useMockMode = useMockMode;
        
        logger.info("ChatService initialized - Model: {}, Mock Mode: {}", model, useMockMode);
    }

    /**
     * Generates a response to the user's message.
     * Routes to either mock or real API based on configuration.
     * 
     * @param userMessage The message from the user
     * @return The generated response
     * @throws ChatException if response generation fails
     */
    @Override
    public String generateResponse(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            throw new IllegalArgumentException("User message cannot be empty");
        }

        logger.info("Processing chat request - Mock mode: {}", useMockMode);
        
        try {
            return useMockMode 
                ? generateMockResponse(userMessage) 
                : generateOpenAiResponse(userMessage);
        } catch (ChatException | IllegalArgumentException e) {
            // Re-throw domain exceptions as-is
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error generating response for message: {}", userMessage, e);
            throw new ChatException("Failed to generate response: " + e.getMessage(), e);
        }
    }

    /**
     * Generates a response using OpenAI API.
     * 
     * @param userMessage The user's message
     * @return AI-generated response
     */
    private String generateOpenAiResponse(String userMessage) {
        logger.debug("Calling OpenAI API for message: {}", userMessage);
        
        ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), userMessage);
        
        ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                .model(model)
                .messages(List.of(chatMessage))
                .maxTokens(maxTokens)
                .temperature(temperature)
                .build();
        
        String response = openAiService.createChatCompletion(completionRequest)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
        
        logger.debug("Received OpenAI response");
        return response;
    }

    /**
     * Generates a mock response based on message content.
     * Used for demonstration purposes or when API is unavailable.
     * 
     * @param userMessage The user's message
     * @return Mock response
     */
    private String generateMockResponse(String userMessage) {
        logger.debug("Generating mock response for: {}", userMessage);
        
        String lowerMessage = userMessage.toLowerCase();
        
        // Pattern matching for mock responses
        if (containsAny(lowerMessage, "hello", "hi", "hey")) {
            return MOCK_RESPONSES.get("greeting");
        } else if (containsAny(lowerMessage, "how are you", "how r u")) {
            return MOCK_RESPONSES.get("status");
        } else if (lowerMessage.contains("name")) {
            return MOCK_RESPONSES.get("name");
        } else if (lowerMessage.contains(KEYWORD_WEATHER)) {
            return MOCK_RESPONSES.get(KEYWORD_WEATHER);
        } else if (lowerMessage.contains("joke")) {
            return MOCK_RESPONSES.get("joke");
        } else if (lowerMessage.contains("help")) {
            return MOCK_RESPONSES.get("help");
        } else if (lowerMessage.contains("thank")) {
            return MOCK_RESPONSES.get("thanks");
        } else if (containsAny(lowerMessage, KEYWORD_BYE, KEYWORD_GOODBYE)) {
            return MOCK_RESPONSES.get(KEYWORD_GOODBYE);
        } else if (lowerMessage.contains("what can you do")) {
            return MOCK_RESPONSES.get("capabilities");
        }
        
        return "That's an interesting question! I'm currently running in demo mode with mock responses. " +
               "Once the OpenAI API is fully configured, I'll be able to provide more detailed and intelligent answers.";
    }

    /**
     * Helper method to check if a string contains any of the given substrings.
     * 
     * @param str The string to check
     * @param substrings Substrings to search for
     * @return true if any substring is found
     */
    private boolean containsAny(String str, String... substrings) {
        for (String substring : substrings) {
            if (str.contains(substring)) {
                return true;
            }
        }
        return false;
    }
}
