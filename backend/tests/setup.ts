import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: 'env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Global test timeout for API tests
jest.setTimeout(15000);

// Suppress console output during tests for cleaner output
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: console.warn, // Keep warnings visible
    error: console.error, // Keep errors visible
  };
}