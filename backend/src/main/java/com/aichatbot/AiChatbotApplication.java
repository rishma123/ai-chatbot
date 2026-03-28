package com.aichatbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class that bootstraps the Spring Boot application.
 * @SpringBootApplication combines @Configuration, @EnableAutoConfiguration, and @ComponentScan
 */
@SpringBootApplication
public class AiChatbotApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiChatbotApplication.class, args);
    }
}
