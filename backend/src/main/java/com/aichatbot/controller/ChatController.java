package com.aichatbot.controller;

import com.aichatbot.dto.ChatRequest;
import com.aichatbot.dto.ChatResponse;
import com.aichatbot.service.IChatService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller that handles HTTP requests for chat operations.
 * Follows REST best practices with proper validation and error handling.
 * 
 * @RestController combines @Controller and @ResponseBody
 * @RequestMapping sets the base path for all endpoints in this controller
 */
@RestController
@RequestMapping("/api")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    
    private final IChatService chatService;

    /**
     * Constructor injection - Spring automatically injects ChatService.
     * @Autowired is optional since Spring 4.3 for single-constructor classes.
     * Uses interface for loose coupling (Dependency Inversion Principle).
     * 
     * @param chatService The chat service implementation
     */
    public ChatController(IChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * POST endpoint that receives a user message and returns a chatbot response.
     * Uses @Valid for automatic request validation based on ChatRequest constraints.
     * 
     * URL: POST http://localhost:8085/api/chat
     * 
     * @param request The ChatRequest containing the user's message (validated)
     * @return ResponseEntity with ChatResponse containing the bot's reply and timestamp
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        logger.debug("Received chat request: {}", request);

        // Call service to generate response
        String botResponse = chatService.generateResponse(request.getMessage());
        
        // Create response DTO
        ChatResponse response = new ChatResponse(botResponse, System.currentTimeMillis());
        
        logger.debug("Sending chat response");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Simple health check endpoint to verify the server is running.
     * 
     * URL: GET http://localhost:8085/api/health
     * 
     * @return ResponseEntity with health status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.debug("Health check requested");
        return ResponseEntity.ok("AI Chatbot Backend is running!");
    }
}
