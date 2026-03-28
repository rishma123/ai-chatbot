import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ChatRequest, ChatResponse } from '../models/chat.model';
import { environment } from '../../environments/environment';
import { APP_CONSTANTS } from '../core/constants/app.constants';

/**
 * Service to handle communication with the Spring Boot backend.
 * Implements error handling, retry logic, and timeout management.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = `${environment.apiUrl}/chat`;
  private readonly healthUrl = `${environment.apiUrl}/health`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a message to the backend and returns the AI response.
   * Includes automatic retry logic and timeout handling.
   * 
   * @param message The user's message
   * @returns Observable with the AI's response
   */
  sendMessage(message: string): Observable<ChatResponse> {
    if (!message || message.trim().length === 0) {
      return throwError(() => new Error(APP_CONSTANTS.MESSAGES.ERROR_EMPTY_MESSAGE));
    }

    const request: ChatRequest = { message: message.trim() };
    
    return this.http.post<ChatResponse>(this.apiUrl, request).pipe(
      timeout(APP_CONSTANTS.API.TIMEOUT),
      retry({
        count: APP_CONSTANTS.API.RETRY_ATTEMPTS,
        delay: (error, retryCount) => {
          // Only retry on server errors (5xx) or network errors
          if (this.shouldRetry(error)) {
            console.warn(`Retrying request (${retryCount}/${APP_CONSTANTS.API.RETRY_ATTEMPTS})...`);
            return timer(APP_CONSTANTS.API.RETRY_DELAY * retryCount);
          }
          return throwError(() => error);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Checks the health status of the backend server.
   * 
   * @returns Observable with the health status message
   */
  checkHealth(): Observable<string> {
    return this.http.get(this.healthUrl, { responseType: 'text' }).pipe(
      timeout(5000),
      catchError(this.handleError)
    );
  }

  /**
   * Determines if the request should be retried based on the error type.
   * 
   * @param error The HTTP error
   * @returns true if the request should be retried
   */
  private shouldRetry(error: any): boolean {
    // Retry on server errors (500-599) or network errors
    return error.status >= 500 || error.status === 0;
  }

  /**
   * Handles HTTP errors with appropriate error messages.
   * 
   * @param error The HTTP error response
   * @returns Observable that throws a user-friendly error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.status === 0) {
      // Client-side or network error
      errorMessage = APP_CONSTANTS.MESSAGES.ERROR_SERVER_UNAVAILABLE;
      console.error('Network error:', error.error);
    } else if (error.status === 400) {
      // Bad request - validation error
      errorMessage = error.error?.message || 'Invalid request. Please check your input.';
    } else if (error.status === 500) {
      // Server error
      errorMessage = error.error?.message || 'Server error occurred. Please try again.';
      console.error('Server error:', error.error);
    } else {
      // Other errors
      errorMessage = `Error: ${error.message}`;
      console.error('HTTP error:', error);
    }

    return throwError(() => new Error(errorMessage));
  }
}
