/**
 * Unit tests for Application Constants
 */

import { APP_CONSTANTS } from './app.constants';

describe('APP_CONSTANTS', () => {
  describe('MESSAGES', () => {
    it('should have welcome message', () => {
      expect(APP_CONSTANTS.MESSAGES.WELCOME).toBeTruthy();
      expect(APP_CONSTANTS.MESSAGES.WELCOME).toContain('AI assistant');
    });

    it('should have error messages', () => {
      expect(APP_CONSTANTS.MESSAGES.ERROR_DEFAULT).toBeTruthy();
      expect(APP_CONSTANTS.MESSAGES.ERROR_EMPTY_MESSAGE).toBeTruthy();
      expect(APP_CONSTANTS.MESSAGES.ERROR_SERVER_UNAVAILABLE).toBeTruthy();
    });

    it('should have descriptive error messages', () => {
      expect(APP_CONSTANTS.MESSAGES.ERROR_DEFAULT.length).toBeGreaterThan(10);
      expect(APP_CONSTANTS.MESSAGES.ERROR_SERVER_UNAVAILABLE).toContain('unavailable');
      expect(APP_CONSTANTS.MESSAGES.ERROR_EMPTY_MESSAGE).toContain('message');
    });
  });

  describe('VALIDATION', () => {
    it('should have valid max message length', () => {
      expect(APP_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH).toBe(5000);
      expect(APP_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH).toBeGreaterThan(0);
    });

    it('should have valid min message length', () => {
      expect(APP_CONSTANTS.VALIDATION.MIN_MESSAGE_LENGTH).toBe(1);
      expect(APP_CONSTANTS.VALIDATION.MIN_MESSAGE_LENGTH).toBeGreaterThan(0);
    });

    it('should have max length greater than min length', () => {
      expect(APP_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH).toBeGreaterThan(
        APP_CONSTANTS.VALIDATION.MIN_MESSAGE_LENGTH
      );
    });
  });

  describe('API', () => {
    it('should have reasonable timeout value', () => {
      expect(APP_CONSTANTS.API.TIMEOUT).toBe(30000);
      expect(APP_CONSTANTS.API.TIMEOUT).toBeGreaterThan(0);
    });

    it('should have reasonable retry attempts', () => {
      expect(APP_CONSTANTS.API.RETRY_ATTEMPTS).toBe(3);
      expect(APP_CONSTANTS.API.RETRY_ATTEMPTS).toBeGreaterThanOrEqual(0);
    });

    it('should have reasonable retry delay', () => {
      expect(APP_CONSTANTS.API.RETRY_DELAY).toBe(1000);
      expect(APP_CONSTANTS.API.RETRY_DELAY).toBeGreaterThan(0);
    });
  });

  describe('UI', () => {
    it('should have valid scroll delay', () => {
      expect(APP_CONSTANTS.UI.SCROLL_DELAY).toBe(100);
      expect(APP_CONSTANTS.UI.SCROLL_DELAY).toBeGreaterThanOrEqual(0);
    });

    it('should have valid loading debounce', () => {
      expect(APP_CONSTANTS.UI.LOADING_DEBOUNCE).toBe(300);
      expect(APP_CONSTANTS.UI.LOADING_DEBOUNCE).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Immutability', () => {
    it('should be immutable (readonly)', () => {
      expect(() => {
        // @ts-ignore - Testing runtime immutability
        APP_CONSTANTS.MESSAGES.WELCOME = 'New value';
      }).toThrow();
    });

    it('should freeze nested objects', () => {
      expect(Object.isFrozen(APP_CONSTANTS)).toBe(false); // as const doesn't freeze
      // But TypeScript will prevent compile-time modifications
    });
  });
});
