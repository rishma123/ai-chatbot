package com.aichatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * DTO (Data Transfer Object) for outgoing chat responses.
 * This represents the data sent back to the client.
 * Uses specific Lombok annotations instead of @Data for better control.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChatResponse {
    
    /**
     * The chatbot's response message
     */
    private String response;
    
    /**
     * Timestamp of when the response was generated (milliseconds since epoch)
     */
    private long timestamp;
}
