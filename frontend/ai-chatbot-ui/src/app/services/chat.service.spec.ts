import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { ChatResponse } from '../models/chat.model';
import { environment } from '../../environments/environment';

describe('ChatService', () => {
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send message and return response', (done) => {
    const testMessage = 'Hello, chatbot!';
    const mockResponse: ChatResponse = {
      response: 'Hello! How can I help you?',
      timestamp: Date.now()
    };

    service.sendMessage(testMessage).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.response).toBe(mockResponse.response);
      expect(response.timestamp).toBe(mockResponse.timestamp);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ message: testMessage });
    req.flush(mockResponse);
  });

  it('should handle empty message error', (done) => {
    service.sendMessage('').subscribe({
      next: () => fail('should have failed with empty message error'),
      error: (error) => {
        expect(error.message).toContain('empty');
        done();
      }
    });

    httpMock.expectNone(`${environment.apiUrl}/chat`);
  });

  it('should trim message before sending', (done) => {
    const testMessage = '  Hello  ';
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

  it('should handle HTTP 500 error', (done) => {
    const testMessage = 'Test message';

    service.sendMessage(testMessage).subscribe({
      next: () => fail('should have failed with server error'),
      error: (error) => {
        expect(error.message).toContain('Server error');
        done();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network error', (done) => {
    const testMessage = 'Test message';

    service.sendMessage(testMessage).subscribe({
      next: () => fail('should have failed with network error'),
      error: (error) => {
        expect(error.message).toContain('unavailable');
        done();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
    req.error(new ProgressEvent('Network error'), { status: 0 });
  });

  it('should check health endpoint', (done) => {
    const mockHealthResponse = 'AI Chatbot Backend is running!';

    service.checkHealth().subscribe(response => {
      expect(response).toBe(mockHealthResponse);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/health`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHealthResponse);
  });
});
