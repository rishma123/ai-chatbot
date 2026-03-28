package com.aichatbot.service;

/**
 * Service interface for chat operations.
 * Defines the contract for chat service implementations.
 * Following SOLID principles - Interface Segregation and Dependency Inversion.
 */
public interface IChatService {
    
    /**
     * Generates a response to the user's message.
     * 
     * @param userMessage The message from the user
     * @return The generated response
     * @throws com.aichatbot.exception.ChatException if response generation fails
     */
    String generateResponse(String userMessage);
}
