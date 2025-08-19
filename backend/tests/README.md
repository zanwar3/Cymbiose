# API Test Suite

A comprehensive test suite for the Cymbiose AI Diagnostic API endpoints.

## Overview

This test suite provides simple, focused testing of all API endpoints without requiring database setup. It uses mocked Prisma client to avoid external dependencies.

## Test Structure

```
tests/
├── api/
│   └── endpoints.test.ts    # Main API endpoint tests
├── setup.ts                 # Test configuration
└── README.md               # This file
```

## Test Coverage

### Health Endpoints
- ✅ Server health check (`GET /health`)
- ✅ Diagnosis service health (`GET /api/diagnoses/health`)

### Root Endpoint
- ✅ API information (`GET /`)

### Diagnosis Endpoints
- ✅ Get diagnosis by client ID (`GET /api/diagnoses/:clientId`)
- ✅ Get diagnosis history (`GET /api/diagnoses/:clientId/history`)
- ✅ Create/update diagnosis (`POST /api/diagnoses/:clientId`)
- ✅ Get diagnosis by ID (`GET /api/diagnoses/by-id/:id`)
- ✅ Update diagnosis (`PUT /api/diagnoses/:id`)

### Validation Testing
- ✅ Invalid UUIDs rejection
- ✅ Missing required fields
- ✅ Empty/invalid data handling
- ✅ Malformed JSON handling

### Error Handling
- ✅ 404 for non-existent routes
- ✅ Proper error response format
- ✅ Security headers validation

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Features

- **No Database Required**: Uses mocked Prisma client
- **Fast Execution**: All tests run in ~1 second
- **Comprehensive Coverage**: Tests all endpoints and edge cases
- **Modern Testing**: Uses Jest + Supertest (2025 standards)
- **Proper Mocking**: Database layer is fully mocked
- **Error Testing**: Validates error responses and status codes

## Test Philosophy

This test suite follows modern 2025 testing practices:

1. **Integration Testing**: Tests the full HTTP request/response cycle
2. **Mocked Dependencies**: No external database required
3. **Fast Feedback**: Quick test execution for rapid development
4. **Comprehensive Coverage**: All endpoints and error scenarios
5. **Maintainable**: Simple, focused test cases

## Mock Strategy

The tests use Jest mocks to simulate:
- Prisma database operations
- Database health checks
- Various response scenarios (success, not found, errors)

This approach ensures tests are:
- Fast and reliable
- Independent of external systems
- Easy to maintain and modify
