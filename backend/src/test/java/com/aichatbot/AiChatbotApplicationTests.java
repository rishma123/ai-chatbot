package com.aichatbot;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Integration tests for the main application.
 */
@SpringBootTest
@TestPropertySource(properties = {
    "openai.api.key=test-key",
    "openai.use-mock-mode=true"
})
class AiChatbotApplicationTests {

    @Test
    void contextLoads() {
        // Test that the application context loads successfully
    }
}
