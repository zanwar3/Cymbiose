import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { createRateLimiter, sanitizeInput, requestLogger } from './middleware/security';

// Import routes
import diagnosisRoutes from './routes/diagnosisRoutes';

// Import configuration
import { specs } from './config/swagger';
import { checkDatabaseHealth } from './utils/dbHealth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy if behind reverse proxy (for rate limiting)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://app.cymbiose.ai'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')  // 100 requests per window
);
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  type: 'application/json'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Security and logging middleware
app.use(sanitizeInput);
app.use(requestLogger);

// API routes
app.use('/api/diagnoses', diagnosisRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Cymbiose AI - Diagnostic Support API',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
}));

// Health check endpoint
app.get('/health', async (req, res) => {
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

    // Return 503 if database is unhealthy
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

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Cymbiose AI Backend Server Started
=====================================
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Port: ${PORT}
📊 Health: http://localhost:${PORT}/health
📚 API Docs: http://localhost:${PORT}/api-docs
🏠 Home: http://localhost:${PORT}/

📋 Available Endpoints:
• GET    /health                           - Health check
• GET    /api-docs                         - API documentation
• GET    /api/diagnoses/:clientId          - Get client diagnosis
• POST   /api/diagnoses/:clientId          - Create/update diagnosis
• PUT    /api/diagnoses/:id                - Update diagnosis by ID
• GET    /api/diagnoses/:clientId/history  - Get diagnosis history
• GET    /api/diagnoses/by-id/:id          - Get diagnosis by ID

🔧 Database: PostgreSQL on port ${process.env.DB_PORT || 5433}
🛡️  Security: Rate limiting, CORS, Helmet enabled
📝 Logging: Request/response logging active (no PII)
  `);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please choose a different port.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

export default app;
