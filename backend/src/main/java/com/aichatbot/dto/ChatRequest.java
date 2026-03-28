package com.aichatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * DTO (Data Transfer Object) for incoming chat requests.
 * This represents the data sent by the client.
 * Uses specific Lombok annotations instead of @Data for better control.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChatRequest {
    
    /**
     * The user's message to the chatbot.
     * Must not be blank and should be between 1 and 5000 characters.
     */
    @NotBlank(message = "Message cannot be empty")
    @Size(min = 1, max = 5000, message = "Message must be between 1 and 5000 characters")
    private String message;
}
