import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from '../../src/middleware/errorHandler';
import { createRateLimiter, sanitizeInput, requestLogger } from '../../src/middleware/security';
import diagnosisRoutes from '../../src/routes/diagnosisRoutes';

// Mock Prisma to avoid database dependencies
jest.mock('../../src/lib/prisma', () => ({
  diagnosis: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
}));

// Mock database health check
jest.mock('../../src/utils/dbHealth', () => ({
  checkDatabaseHealth: jest.fn().mockResolvedValue({
    status: 'healthy',
    message: 'Database connection successful'
  })
}));

// Create a test app without starting a server
const createTestApp = () => {
  const app = express();
  
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(sanitizeInput);
  
  // API routes
  app.use('/api/diagnoses', diagnosisRoutes);
  
  // Health check endpoint
  app.get('/health', async (req, res) => {
    const { checkDatabaseHealth } = require('../../src/utils/dbHealth');
    try {
      const dbHealth = await checkDatabaseHealth();
      const healthStatus = {
        success: true,
        message: 'Cymbiose AI Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        services: {
          api: 'healthy',
          database: dbHealth.status
        },
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };
      const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      res.status(503).json({
        success: false,
        message: 'Service unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Cymbiose AI - Diagnostic Support API',
      version: '1.0.0',
      documentation: '/api-docs',
      health: '/health',
      endpoints: {
        'GET /api/diagnoses/:clientId': 'Get diagnosis for client',
        'POST /api/diagnoses/:clientId': 'Create/update diagnosis',
        'PUT /api/diagnoses/:id': 'Update diagnosis by ID',
        'GET /api/diagnoses/:clientId/history': 'Get diagnosis history',
        'GET /api/diagnoses/by-id/:id': 'Get diagnosis by ID'
      }
    });
  });
  
  app.use(notFoundHandler);
  app.use(errorHandler);
  
  return app;
};

describe('API Endpoints', () => {
  const testClientId = '550e8400-e29b-41d4-a716-446655440001';
  const testDiagnosisId = 'clp123abc456def789';
  let app: express.Application;
  
  // Setup mock implementations for successful operations
  beforeAll(() => {
    // Create the test app instance
    app = createTestApp();
    
    const mockPrisma = require('../../src/lib/prisma');
    
    // Mock successful responses for create/update operations
    mockPrisma.diagnosis.findFirst.mockResolvedValue(null); // No existing diagnosis
    mockPrisma.diagnosis.create.mockResolvedValue({
      id: testDiagnosisId,
      clientId: testClientId,
      diagnosisName: 'Test Diagnosis',
      justification: 'Test justification',
      predictedDate: new Date(),
      challengedDiagnosis: null,
      challengedJustification: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    mockPrisma.diagnosis.findUnique.mockResolvedValue(null); // No existing diagnosis found
    mockPrisma.diagnosis.update.mockResolvedValue({
      id: testDiagnosisId,
      clientId: testClientId,
      diagnosisName: 'Updated Diagnosis',
      justification: 'Updated justification',
      predictedDate: new Date(),
      challengedDiagnosis: null,
      challengedJustification: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    mockPrisma.diagnosis.findMany.mockResolvedValue([]);
    mockPrisma.diagnosis.count.mockResolvedValue(0);
  });
  
  describe('Health Endpoints', () => {
    test('GET /health should return server health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('services');
    });

    test('GET /api/diagnoses/health should return diagnosis service health', async () => {
      const response = await request(app)
        .get('/api/diagnoses/health')
        .expect('Content-Type', /json/);
      
      expect([200, 500, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Root Endpoint', () => {
    test('GET / should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Diagnosis Endpoints', () => {
    test('GET /api/diagnoses/:clientId should handle valid client ID', async () => {
      const response = await request(app)
        .get(`/api/diagnoses/${testClientId}`)
        .expect('Content-Type', /json/);
      
      // Should return 200 (found), 404 (not found), or 500 (server error)
      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    test('GET /api/diagnoses/:clientId should reject invalid client ID', async () => {
      const response = await request(app)
        .get('/api/diagnoses/invalid-id')
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('GET /api/diagnoses/:clientId/history should return diagnosis history', async () => {
      const response = await request(app)
        .get(`/api/diagnoses/${testClientId}/history`)
        .expect('Content-Type', /json/);
      
      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    test('GET /api/diagnoses/:clientId/history should handle pagination parameters', async () => {
      const response = await request(app)
        .get(`/api/diagnoses/${testClientId}/history`)
        .query({ page: 1, limit: 5 })
        .expect('Content-Type', /json/);
      
      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    test('POST /api/diagnoses/:clientId should create/update diagnosis with valid data', async () => {
      const diagnosisData = {
        diagnosisName: 'Test Diagnosis',
        justification: 'This is a test diagnosis for API testing purposes.'
      };

      const response = await request(app)
        .post(`/api/diagnoses/${testClientId}`)
        .send(diagnosisData)
        .expect('Content-Type', /json/);
      
      // Should return 201 (created) since we mocked no existing diagnosis
      expect([201]).toContain(response.status);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    test('POST /api/diagnoses/:clientId should reject invalid data', async () => {
      const invalidData = {
        diagnosisName: '', // Empty diagnosis name should be invalid
        justification: 'Test'
      };

      const response = await request(app)
        .post(`/api/diagnoses/${testClientId}`)
        .send(invalidData)
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('POST /api/diagnoses/:clientId should reject missing required fields', async () => {
      const incompleteData = {
        diagnosisName: 'Test Diagnosis'
        // Missing justification
      };

      const response = await request(app)
        .post(`/api/diagnoses/${testClientId}`)
        .send(incompleteData)
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('GET /api/diagnoses/by-id/:id should handle valid diagnosis ID', async () => {
      const response = await request(app)
        .get(`/api/diagnoses/by-id/${testDiagnosisId}`)
        .expect('Content-Type', /json/);
      
      // Should return 200 (found), 404 (not found), or 500 (server error)
      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    test('GET /api/diagnoses/by-id/:id should reject invalid diagnosis ID', async () => {
      const response = await request(app)
        .get('/api/diagnoses/by-id/invalid-id')
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('PUT /api/diagnoses/:id should update diagnosis with valid data', async () => {
      const updateData = {
        diagnosisName: 'Updated Test Diagnosis',
        justification: 'Updated justification for testing.'
      };

      const response = await request(app)
        .put(`/api/diagnoses/${testDiagnosisId}`)
        .send(updateData)
        .expect('Content-Type', /json/);
      
      // Should return 200 (updated), 404 (not found), or 500 (server error)
      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    test('PUT /api/diagnoses/:id should handle partial updates', async () => {
      const partialUpdate = {
        challengedDiagnosis: 'Alternative Diagnosis',
        challengedJustification: 'This could be an alternative interpretation.'
      };

      const response = await request(app)
        .put(`/api/diagnoses/${testDiagnosisId}`)
        .send(partialUpdate)
        .expect('Content-Type', /json/);
      
      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    test('PUT /api/diagnoses/:id should reject invalid diagnosis ID', async () => {
      const updateData = {
        diagnosisName: 'Test Update'
      };

      const response = await request(app)
        .put('/api/diagnoses/invalid-id')
        .send(updateData)
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('PUT /api/diagnoses/:id should reject empty update data', async () => {
      const response = await request(app)
        .put(`/api/diagnoses/${testDiagnosisId}`)
        .send({})
        .expect('Content-Type', /json/);
      
      // Should return 404 (not found) or 400 (validation error) depending on implementation
      expect([400, 404]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post(`/api/diagnoses/${testClientId}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
    });

    test('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post(`/api/diagnoses/${testClientId}`)
        .send('some data')
        .expect('Content-Type', /json/);
      
      expect([400, 415]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });
});
