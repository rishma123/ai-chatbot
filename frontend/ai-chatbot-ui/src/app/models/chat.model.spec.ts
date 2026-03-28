/**
 * Unit tests for ChatMessage model
 */

import { ChatMessage, ChatRequest, ChatResponse } from './chat.model';

describe('ChatMessage Model', () => {
  it('should create a valid ChatMessage', () => {
    const message: ChatMessage = {
      content: 'Hello, world!',
      isUser: true,
      timestamp: new Date()
    };

    expect(message.content).toBe('Hello, world!');
    expect(message.isUser).toBe(true);
    expect(message.timestamp).toBeInstanceOf(Date);
  });

  it('should allow empty content', () => {
    const message: ChatMessage = {
      content: '',
      isUser: false,
      timestamp: new Date()
    };

    expect(message.content).toBe('');
  });

  it('should handle different timestamp values', () => {
    const now = new Date();
    const message: ChatMessage = {
      content: 'Test',
      isUser: true,
      timestamp: now
    };

    expect(message.timestamp.getTime()).toBe(now.getTime());
  });
});

describe('ChatRequest Model', () => {
  it('should create a valid ChatRequest', () => {
    const request: ChatRequest = {
      message: 'Hello, chatbot!'
    };

    expect(request.message).toBe('Hello, chatbot!');
  });

  it('should allow empty message', () => {
    const request: ChatRequest = {
      message: ''
    };

    expect(request.message).toBe('');
  });

  it('should handle long messages', () => {
    const longMessage = 'a'.repeat(5000);
    const request: ChatRequest = {
      message: longMessage
    };

    expect(request.message.length).toBe(5000);
  });
});

describe('ChatResponse Model', () => {
  it('should create a valid ChatResponse', () => {
    const response: ChatResponse = {
      response: 'Hello! How can I help?',
      timestamp: Date.now()
    };

    expect(response.response).toBe('Hello! How can I help?');
    expect(response.timestamp).toBeGreaterThan(0);
  });

  it('should handle zero timestamp', () => {
    const response: ChatResponse = {
      response: 'Test',
      timestamp: 0
    };

    expect(response.timestamp).toBe(0);
  });

  it('should handle empty response', () => {
    const response: ChatResponse = {
      response: '',
      timestamp: Date.now()
    };

    expect(response.response).toBe('');
  });

  it('should handle future timestamps', () => {
    const futureTimestamp = Date.now() + 1000000;
    const response: ChatResponse = {
      response: 'Test',
      timestamp: futureTimestamp
    };

    expect(response.timestamp).toBe(futureTimestamp);
  });
});
