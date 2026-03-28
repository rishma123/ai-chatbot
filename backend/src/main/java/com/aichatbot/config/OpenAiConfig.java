package com.aichatbot.config;

import com.theokanning.openai.service.OpenAiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration class for OpenAI service.
 * Separates configuration concerns from business logic.
 */
@Configuration
public class OpenAiConfig {

    private static final Logger logger = LoggerFactory.getLogger(OpenAiConfig.class);
    private static final int TIMEOUT_SECONDS = 60;

    @Value("${openai.api.key}")
    private String apiKey;

    /**
     * Creates and configures the OpenAI service bean.
     * 
     * @return Configured OpenAiService instance
     * @throws IllegalStateException if API key is not configured
     */
    @Bean
    public OpenAiService openAiService() {
        if (apiKey == null || apiKey.isEmpty()) {
            logger.error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");
            throw new IllegalStateException("OpenAI API key is not configured");
        }
        
        logger.info("Initializing OpenAI service with timeout: {} seconds", TIMEOUT_SECONDS);
        return new OpenAiService(apiKey, Duration.ofSeconds(TIMEOUT_SECONDS));
    }
}
