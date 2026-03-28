package com.aichatbot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for the root URL and welcome page.
 * Provides API documentation and server status.
 */
@RestController
public class HomeController {

    /**
     * Welcome page with API documentation.
     * Returns an HTML page describing available endpoints.
     * 
     * @return HTML content as string
     */
    @GetMapping("/")
    public String home() {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>AI Chatbot Backend</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
                        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        h1 { color: #2c3e50; }
                        .status { color: #27ae60; font-size: 18px; font-weight: bold; }
                        .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; }
                        .method { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; color: white; margin-right: 10px; }
                        .get { background: #3498db; }
                        .post { background: #e74c3c; }
                        code { background: #34495e; color: #ecf0f1; padding: 2px 6px; border-radius: 3px; }
                        .test-section { margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🤖 AI Chatbot Backend</h1>
                        <p class="status">✅ Server is running successfully!</p>
                        
                        <h2>📡 Available Endpoints:</h2>
                        
                        <div class="endpoint">
                            <span class="method get">GET</span>
                            <strong>/api/health</strong>
                            <p>Health check endpoint to verify the server is running</p>
                        </div>
                        
                        <div class="endpoint">
                            <span class="method post">POST</span>
                            <strong>/api/chat</strong>
                            <p>Send a message to the AI chatbot</p>
                            <p><strong>Request Body:</strong></p>
                            <code>{ "message": "Your question here" }</code>
                        </div>
                        
                        <div class="test-section">
                            <h3>🧪 Test the API:</h3>
                            <p><strong>1. Test Health Check:</strong></p>
                            <p><a href="/api/health" target="_blank">Click here to test /api/health</a></p>
                            
                            <p><strong>2. Test Chat (PowerShell):</strong></p>
                            <code style="display:block; padding:10px; white-space: pre-wrap;">
$body = @{ message = "Hello AI!" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8085/api/chat" -Method POST -Body $body -ContentType "application/json"
                            </code>
                        </div>
                        
                        <p style="margin-top: 30px; color: #7f8c8d;">
                            <strong>Tech Stack:</strong> Spring Boot 3.2.3 | Java 17 | OpenAI GPT-3.5-turbo
                        </p>
                    </div>
                </body>
                </html>
                """;
    }
}
