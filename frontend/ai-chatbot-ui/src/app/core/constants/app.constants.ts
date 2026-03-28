/**
 * Application-wide constants.
 * Centralizes magic strings and numbers for better maintainability.
 */
export const APP_CONSTANTS = {
  MESSAGES: {
    WELCOME: "Hello! I'm your AI assistant. How can I help you today?",
    ERROR_DEFAULT: 'Failed to get response. Please check if the backend is running.',
    ERROR_EMPTY_MESSAGE: 'Please enter a message',
    ERROR_SERVER_UNAVAILABLE: 'Server is currently unavailable. Please try again later.'
  },
  
  VALIDATION: {
    MAX_MESSAGE_LENGTH: 5000,
    MIN_MESSAGE_LENGTH: 1
  },
  
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 second
  },
  
  UI: {
    SCROLL_DELAY: 100, // milliseconds
    LOADING_DEBOUNCE: 300 // milliseconds
  }
} as const;
