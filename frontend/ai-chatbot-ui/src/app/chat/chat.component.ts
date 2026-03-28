import { Component, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/chat.model';
import { APP_CONSTANTS } from '../core/constants/app.constants';

/**
 * Main chat component that displays the chat interface.
 * Implements proper lifecycle management and unsubscription.
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy, AfterViewChecked {
  @ViewChild('chatMessages') private readonly chatMessagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  error = '';
  
  private readonly destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  // Expose constants to template
  readonly maxLength = APP_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH;

  constructor(private readonly chatService: ChatService) {
    this.initializeChat();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initializes the chat with a welcome message.
   */
  private initializeChat(): void {
    this.addMessage(APP_CONSTANTS.MESSAGES.WELCOME, false);
  }

  /**
   * Sends the user's message and gets AI response.
   */
  sendMessage(): void {
    const trimmedInput = this.userInput.trim();
    
    // Validation
    if (!trimmedInput || this.isLoading) {
      return;
    }

    if (trimmedInput.length > this.maxLength) {
      this.showError(`Message too long. Maximum ${this.maxLength} characters allowed.`);
      return;
    }

    // Add user message to chat
    this.addMessage(trimmedInput, true);
    
    // Clear input and reset error
    this.userInput = '';
    this.error = '';
    this.isLoading = true;

    // Call backend API
    this.chatService.sendMessage(trimmedInput)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.addMessage(response.response, false, new Date(response.timestamp));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error calling chat API:', err);
          this.showError(err.message || APP_CONSTANTS.MESSAGES.ERROR_DEFAULT);
          this.isLoading = false;
        }
      });
  }

  /**
   * Handles Enter key press to send message.
   * Shift+Enter adds a new line.
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Clears the error message.
   */
  clearError(): void {
    this.error = '';
  }

  /**
   * Adds a message to the chat history.
   * 
   * @param content The message content
   * @param isUser Whether the message is from the user
   * @param timestamp Optional timestamp (defaults to now)
   */
  private addMessage(content: string, isUser: boolean, timestamp: Date = new Date()): void {
    const message: ChatMessage = {
      content,
      isUser,
      timestamp
    };
    this.messages.push(message);
    this.shouldScrollToBottom = true;
  }

  /**
   * Displays an error message.
   * 
   * @param message The error message to display
   */
  private showError(message: string): void {
    this.error = message;
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      if (this.error === message) {
        this.error = '';
      }
    }, 5000);
  }

  /**
   * Scrolls to the bottom of the chat container.
   * Uses ViewChild for proper DOM access instead of direct querySelector.
   */
  private scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop = 
          this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  /**
   * Returns the character count for the input field.
   */
  get characterCount(): number {
    return this.userInput.length;
  }

  /**
   * Returns whether the input is approaching the character limit.
   */
  get isNearLimit(): boolean {
    return this.userInput.length > this.maxLength * 0.9;
  }
}
