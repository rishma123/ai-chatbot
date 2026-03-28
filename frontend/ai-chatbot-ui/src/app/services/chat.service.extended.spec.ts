/**
 * Integration tests for ChatService error handling and edge cases
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { ChatResponse } from '../models/chat.model';
import { environment } from '../../environments/environment';
import { APP_CONSTANTS } from '../core/constants/app.constants';

describe('ChatService - Extended Tests', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Message Validation', () => {
    it('should reject whitespace-only message', (done) => {
      service.sendMessage('   ').subscribe({
        next: () => fail('should have failed with empty message error'),
        error: (error) => {
          expect(error.message).toContain('empty');
          done();
        }
      });

      httpMock.expectNone(`${environment.apiUrl}/chat`);
    });

    it('should reject null message', (done) => {
      service.sendMessage(null as any).subscribe({
        next: () => fail('should have failed with empty message error'),
        error: (error) => {
          expect(error.message).toBeTruthy();
          done();
        }
      });

      httpMock.expectNone(`${environment.apiUrl}/chat`);
    });

    it('should reject undefined message', (done) => {
      service.sendMessage(undefined as any).subscribe({
        next: () => fail('should have failed with empty message error'),
        error: (error) => {
          expect(error.message).toBeTruthy();
          done();
        }
      });

      httpMock.expectNone(`${environment.apiUrl}/chat`);
    });
  });

  describe('HTTP Error Handling', () => {
    it('should handle 400 Bad Request error', (done) => {
      const testMessage = 'Test message';
      const errorResponse = { message: 'Invalid request format' };

      service.sendMessage(testMessage).subscribe({
        next: () => fail('should have failed with bad request error'),
        error: (error) => {
          expect(error.message).toContain('Invalid');
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 Unauthorized error', (done) => {
      const testMessage = 'Test message';

      service.sendMessage(testMessage).subscribe({
        next: () => fail('should have failed with unauthorized error'),
        error: (error) => {
          expect(error.message).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 404 Not Found error', (done) => {
      const testMessage = 'Test message';

      service.sendMessage(testMessage).subscribe({
        next: () => fail('should have failed with not found error'),
        error: (error) => {
          expect(error.message).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 503 Service Unavailable error', (done) => {
      const testMessage = 'Test message';

      service.sendMessage(testMessage).subscribe({
        next: () => fail('should have failed with service unavailable error'),
        error: (error) => {
          expect(error.message).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('Response Validation', () => {
    it('should handle response with all valid fields', (done) => {
      const testMessage = 'Hello';
      const mockResponse: ChatResponse = {
        response: 'Hello! How can I help?',
        timestamp: 1234567890
      };

      service.sendMessage(testMessage).subscribe(response => {
        expect(response.response).toBe(mockResponse.response);
        expect(response.timestamp).toBe(mockResponse.timestamp);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      req.flush(mockResponse);
    });

    it('should handle response with empty string', (done) => {
      const testMessage = 'Hello';
      const mockResponse: ChatResponse = {
        response: '',
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(response => {
        expect(response.response).toBe('');
        expect(response.timestamp).toBeGreaterThan(0);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      req.flush(mockResponse);
    });

    it('should handle response with very long text', (done) => {
      const testMessage = 'Tell me a story';
      const longResponse = 'a'.repeat(10000);
      const mockResponse: ChatResponse = {
        response: longResponse,
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(response => {
        expect(response.response.length).toBe(10000);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      req.flush(mockResponse);
    });
  });

  describe('Health Check', () => {
    it('should handle health check success', (done) => {
      const mockHealth = 'Backend is running!';

      service.checkHealth().subscribe(response => {
        expect(response).toBe(mockHealth);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHealth);
    });

    it('should handle health check failure', (done) => {
      service.checkHealth().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/health`);
      req.error(new ProgressEvent('error'));
    });

    it('should timeout health check after 5 seconds', fakeAsync(() => {
      let errorOccurred = false;

      service.checkHealth().subscribe({
        next: () => fail('should have timed out'),
        error: () => {
          errorOccurred = true;
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/health`);
      
      tick(5001);
      
      expect(errorOccurred).toBe(true);
    }));
  });

  describe('Message Trimming', () => {
    it('should trim leading spaces', (done) => {
      const testMessage = '   Hello';
      const mockResponse: ChatResponse = {
        response: 'Hi',
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      expect(req.request.body.message).toBe('Hello');
      req.flush(mockResponse);
    });

    it('should trim trailing spaces', (done) => {
      const testMessage = 'Hello   ';
      const mockResponse: ChatResponse = {
        response: 'Hi',
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      expect(req.request.body.message).toBe('Hello');
      req.flush(mockResponse);
    });

    it('should preserve internal spaces', (done) => {
      const testMessage = '  Hello   World  ';
      const mockResponse: ChatResponse = {
        response: 'Hi',
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      expect(req.request.body.message).toBe('Hello   World');
      req.flush(mockResponse);
    });
  });

  describe('Special Characters', () => {
    it('should handle Unicode characters', (done) => {
      const testMessage = '你好 🌟 مرحبا';
      const mockResponse: ChatResponse = {
        response: 'Hello!',
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      expect(req.request.body.message).toBe(testMessage.trim());
      req.flush(mockResponse);
    });

    it('should handle special HTML characters', (done) => {
      const testMessage = '<script>alert("test")</script>';
      const mockResponse: ChatResponse = {
        response: 'Hello!',
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      expect(req.request.body.message).toBe(testMessage);
      req.flush(mockResponse);
    });

    it('should handle line breaks and tabs', (done) => {
      const testMessage = 'Hello\nWorld\tTest';
      const mockResponse: ChatResponse = {
        response: 'Hello!',
        timestamp: Date.now()
      };

      service.sendMessage(testMessage).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
      expect(req.request.body.message).toBe(testMessage.trim());
      req.flush(mockResponse);
    });
  });
});
