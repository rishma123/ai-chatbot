import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '../services/chat.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChatResponse } from '../models/chat.model';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatService: jasmine.SpyObj<ChatService>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with welcome message', () => {
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].isUser).toBeFalse();
    expect(component.messages[0].content).toContain('AI assistant');
  });

  it('should send message successfully', (done) => {
    const testMessage = 'Hello!';
    const mockResponse: ChatResponse = {
      response: 'Hello! How can I help?',
      timestamp: Date.now()
    };

    chatService.sendMessage.and.returnValue(of(mockResponse));
    component.userInput = testMessage;

    component.sendMessage();

    setTimeout(() => {
      expect(component.messages.length).toBe(3); // Welcome + user + bot
      expect(component.messages[1].content).toBe(testMessage);
      expect(component.messages[1].isUser).toBeTrue();
      expect(component.messages[2].content).toBe(mockResponse.response);
      expect(component.messages[2].isUser).toBeFalse();
      expect(component.isLoading).toBeFalse();
      done();
    }, 100);
  });

  it('should not send empty message', () => {
    component.userInput = '';
    const initialLength = component.messages.length;

    component.sendMessage();

    expect(component.messages.length).toBe(initialLength);
    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it('should not send message while loading', () => {
    component.userInput = 'Test';
    component.isLoading = true;
    const initialLength = component.messages.length;

    component.sendMessage();

    expect(component.messages.length).toBe(initialLength);
    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it('should handle error when sending message', (done) => {
    const testMessage = 'Test message';
    const errorMessage = 'Server error';

    chatService.sendMessage.and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    component.userInput = testMessage;

    component.sendMessage();

    setTimeout(() => {
      expect(component.error).toBe(errorMessage);
      expect(component.isLoading).toBeFalse();
      done();
    }, 100);
  });

  it('should clear input after sending', () => {
    const testMessage = 'Hello!';
    const mockResponse: ChatResponse = {
      response: 'Hi!',
      timestamp: Date.now()
    };

    chatService.sendMessage.and.returnValue(of(mockResponse));
    component.userInput = testMessage;

    component.sendMessage();

    expect(component.userInput).toBe('');
  });

  it('should handle Enter key press', () => {
    spyOn(component, 'sendMessage');
    const event = new KeyboardEvent('keypress', { key: 'Enter' });

    component.onKeyPress(event);

    expect(component.sendMessage).toHaveBeenCalled();
  });

  it('should not send on Shift+Enter', () => {
    spyOn(component, 'sendMessage');
    const event = new KeyboardEvent('keypress', { key: 'Enter', shiftKey: true });

    component.onKeyPress(event);

    expect(component.sendMessage).not.toHaveBeenCalled();
  });

  it('should clear error message', () => {
    component.error = 'Test error';

    component.clearError();

    expect(component.error).toBe('');
  });

  it('should not allow message longer than max length', () => {
    const longMessage = 'a'.repeat(5001);
    const mockResponse: ChatResponse = {
      response: 'Response',
      timestamp: Date.now()
    };

    chatService.sendMessage.and.returnValue(of(mockResponse));
    component.userInput = longMessage;

    component.sendMessage();

    expect(component.error).toContain('too long');
    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it('should calculate character count correctly', () => {
    component.userInput = 'Test';
    expect(component.characterCount).toBe(4);

    component.userInput = '';
    expect(component.characterCount).toBe(0);
  });

  it('should detect near limit status', () => {
    component.userInput = 'a'.repeat(4500);
    expect(component.isNearLimit).toBeTrue();

    component.userInput = 'a'.repeat(100);
    expect(component.isNearLimit).toBeFalse();
  });

  it('should cleanup on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
