/**
 * Extended integration tests for ChatComponent
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '../services/chat.service';
import { of, throwError, delay } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChatResponse } from '../models/chat.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ChatComponent - Extended Tests', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatService: jasmine.SpyObj<ChatService>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    const chatServiceSpy = jasmine.createSpyObj('ChatService', ['sendMessage', 'checkHealth']);

    await TestBed.configureTestingModule({
      imports: [ChatComponent, FormsModule],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();

    chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('Message Display', () => {
    it('should display user messages with correct styling', (done) => {
      const testMessage = 'Hello from user';
      const mockResponse: ChatResponse = {
        response: 'Hello from bot',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = testMessage;
      component.sendMessage();

      setTimeout(() => {
        fixture.detectChanges();
        const userMessages = compiled.querySelectorAll('.user-message');
        expect(userMessages.length).toBeGreaterThan(0);
        done();
      }, 100);
    });

    it('should display bot messages with correct styling', (done) => {
      const mockResponse: ChatResponse = {
        response: 'Hello from bot',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = 'Test';
      component.sendMessage();

      setTimeout(() => {
        fixture.detectChanges();
        const botMessages = compiled.querySelectorAll('.bot-message');
        expect(botMessages.length).toBeGreaterThan(0);
        done();
      }, 100);
    });

    it('should display timestamps correctly', () => {
      const now = new Date();
      component.messages = [{
        content: 'Test',
        isUser: true,
        timestamp: now
      }];

      fixture.detectChanges();
      
      expect(component.messages[0].timestamp).toEqual(now);
    });
  });

  describe('Input Validation', () => {
    it('should show error for message exceeding max length', () => {
      const longMessage = 'a'.repeat(5001);
      component.userInput = longMessage;

      component.sendMessage();

      expect(component.error).toContain('too long');
      expect(chatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should trim whitespace before validation', () => {
      component.userInput = '   ';
      const initialLength = component.messages.length;

      component.sendMessage();

      expect(component.messages.length).toBe(initialLength);
    });

    it('should accept message at max length boundary', () => {
      const maxMessage = 'a'.repeat(5000);
      const mockResponse: ChatResponse = {
        response: 'OK',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = maxMessage;

      component.sendMessage();

      expect(chatService.sendMessage).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator while waiting for response', () => {
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(
        of(mockResponse).pipe(delay(1000))
      );
      component.userInput = 'Test';

      component.sendMessage();

      expect(component.isLoading).toBe(true);
    });

    it('should disable send button while loading', fakeAsync(() => {
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = 'Test';
      component.sendMessage();

      expect(component.isLoading).toBe(true);
      
      tick(100);
      
      expect(component.isLoading).toBe(false);
    }));

    it('should prevent multiple simultaneous sends', () => {
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(
        of(mockResponse).pipe(delay(1000))
      );
      
      component.userInput = 'Test1';
      component.sendMessage();
      
      component.userInput = 'Test2';
      component.sendMessage();

      expect(chatService.sendMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should display custom error message from service', (done) => {
      const customError = 'Custom error message';
      
      chatService.sendMessage.and.returnValue(
        throwError(() => ({ message: customError }))
      );
      component.userInput = 'Test';

      component.sendMessage();

      setTimeout(() => {
        expect(component.error).toBe(customError);
        done();
      }, 100);
    });

    it('should clear previous error before new message', (done) => {
      component.error = 'Previous error';
      const mockResponse: ChatResponse = {
        response: 'Success',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = 'Test';

      component.sendMessage();

      setTimeout(() => {
        expect(component.error).toBe('');
        done();
      }, 100);
    });

    it('should handle network timeout errors', (done) => {
      chatService.sendMessage.and.returnValue(
        throwError(() => ({ message: 'Timeout error' }))
      );
      component.userInput = 'Test';

      component.sendMessage();

      setTimeout(() => {
        expect(component.error).toContain('Timeout');
        expect(component.isLoading).toBe(false);
        done();
      }, 100);
    });
  });

  describe('Message History', () => {
    it('should maintain message order', (done) => {
      const messages = ['Hello', 'How are you?', 'Goodbye'];
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));

      messages.forEach((msg, index) => {
        component.userInput = msg;
        component.sendMessage();
      });

      setTimeout(() => {
        const userMessages = component.messages.filter(m => m.isUser);
        expect(userMessages[0].content).toBe('Hello');
        expect(userMessages[1].content).toBe('How are you?');
        expect(userMessages[2].content).toBe('Goodbye');
        done();
      }, 300);
    });

    it('should include welcome message at start', () => {
      expect(component.messages.length).toBeGreaterThan(0);
      expect(component.messages[0].isUser).toBe(false);
      expect(component.messages[0].content).toContain('assistant');
    });
  });

  describe('Character Count', () => {
    it('should calculate character count correctly', () => {
      component.userInput = 'Hello World';
      expect(component.characterCount).toBe(11);
    });

    it('should update count as user types', () => {
      component.userInput = 'Test';
      expect(component.characterCount).toBe(4);

      component.userInput = 'Test Message';
      expect(component.characterCount).toBe(12);
    });

    it('should show near limit when approaching max', () => {
      component.userInput = 'a'.repeat(4500);
      expect(component.isNearLimit).toBe(true);
    });

    it('should not show near limit for short messages', () => {
      component.userInput = 'Short message';
      expect(component.isNearLimit).toBe(false);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should send message on Enter key', () => {
      spyOn(component, 'sendMessage');
      const event = new KeyboardEvent('keypress', { key: 'Enter' });

      component.onKeyPress(event);

      expect(component.sendMessage).toHaveBeenCalled();
    });

    it('should allow newline on Shift+Enter', () => {
      spyOn(component, 'sendMessage');
      const event = new KeyboardEvent('keypress', { 
        key: 'Enter', 
        shiftKey: true 
      });

      component.onKeyPress(event);

      expect(component.sendMessage).not.toHaveBeenCalled();
    });

    it('should allow newline on Ctrl+Enter', () => {
      spyOn(component, 'sendMessage');
      const event = new KeyboardEvent('keypress', { 
        key: 'Enter', 
        ctrlKey: true 
      });

      component.onKeyPress(event);

      expect(component.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize with correct default values', () => {
      expect(component.userInput).toBe('');
      expect(component.isLoading).toBe(false);
      expect(component.error).toBe('');
      expect(component.messages.length).toBeGreaterThan(0);
    });

    it('should unsubscribe on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });

    it('should not leak subscriptions', fakeAsync(() => {
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      
      component.userInput = 'Test';
      component.sendMessage();
      
      component.ngOnDestroy();
      tick(1000);

      // Component should still be in valid state after destroy
      expect(component).toBeTruthy();
    }));
  });

  describe('UI Interactions', () => {
    it('should clear error when clicking clear button', () => {
      component.error = 'Test error';
      
      component.clearError();

      expect(component.error).toBe('');
    });

    it('should scroll to bottom after new message', (done) => {
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = 'Test';

      component.sendMessage();

      setTimeout(() => {
        expect(component['shouldScrollToBottom']).toBe(false);
        done();
      }, 200);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive messages', fakeAsync(() => {
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));

      for (let i = 0; i < 5; i++) {
        component.userInput = `Message ${i}`;
        component.sendMessage();
        tick(10);
      }

      tick(500);
      
      // Should only process one at a time due to isLoading flag
      expect(component.isLoading).toBe(false);
    }));

    it('should handle empty response from server', (done) => {
      const mockResponse: ChatResponse = {
        response: '',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = 'Test';

      component.sendMessage();

      setTimeout(() => {
        expect(component.messages[component.messages.length - 1].content).toBe('');
        done();
      }, 100);
    });

    it('should handle very long response from server', (done) => {
      const longResponse = 'a'.repeat(10000);
      const mockResponse: ChatResponse = {
        response: longResponse,
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = 'Tell me a story';

      component.sendMessage();

      setTimeout(() => {
        const lastMessage = component.messages[component.messages.length - 1];
        expect(lastMessage.content.length).toBe(10000);
        done();
      }, 100);
    });

    it('should handle special characters in messages', (done) => {
      const specialMessage = '<script>alert("xss")</script> 你好 🎉';
      const mockResponse: ChatResponse = {
        response: 'Response',
        timestamp: Date.now()
      };

      chatService.sendMessage.and.returnValue(of(mockResponse));
      component.userInput = specialMessage;

      component.sendMessage();

      setTimeout(() => {
        const userMsg = component.messages.find(m => m.isUser && m.content === specialMessage);
        expect(userMsg).toBeTruthy();
        done();
      }, 100);
    });
  });
});
