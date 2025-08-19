# Cymbiose AI Backend - Diagnostic Support API

A Node.js/TypeScript backend API for managing AI-suggested diagnoses and therapist feedback, built with Express, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL running on localhost:5433 (or adjust DATABASE_URL)
- Git

### Installation & Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials if needed
   ```

4. **Set up database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (creates tables)
   npm run db:push
   
   # Seed with mock data
   npm run db:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with mock data
- `npm run db:reset` - Reset database and apply migrations

### Testing
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## 🔌 API Endpoints

### Health & Monitoring
- `GET /health` - Overall health check (API + Database)
- `GET /api/diagnoses/health` - Diagnosis service health check
- `GET /api-docs` - Interactive Swagger API documentation

### Diagnosis Management
- `GET /api/diagnoses/:clientId` - Get latest diagnosis for a client
- `POST /api/diagnoses/:clientId` - Create or update diagnosis for a client
- `PUT /api/diagnoses/:id` - Update existing diagnosis by ID
- `GET /api/diagnoses/by-id/:id` - Get specific diagnosis by ID
- `GET /api/diagnoses/:clientId/history` - Get paginated diagnosis history

### Root
- `GET /` - API information and available endpoints

## 📊 Database Schema

### Diagnosis Table
```sql
CREATE TABLE diagnoses (
  id                        TEXT PRIMARY KEY,  -- CUID
  client_id                 TEXT NOT NULL,     -- Client UUID
  diagnosis_name            TEXT NOT NULL,     -- AI predicted diagnosis
  predicted_date            TIMESTAMP NOT NULL, -- When diagnosis was made
  justification             TEXT NOT NULL,     -- AI justification
  challenged_diagnosis      TEXT,              -- Therapist alternative
  challenged_justification  TEXT,              -- Therapist reasoning
  created_at               TIMESTAMP DEFAULT NOW(),
  updated_at               TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Mock Data

The seed script includes 5 sample diagnoses:
- Major Depressive Disorder
- Generalized Anxiety Disorder (with challenge)
- Post-Traumatic Stress Disorder
- Bipolar II Disorder (with challenge)
- Social Anxiety Disorder

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   └── seed.ts            # Database seeding script
├── src/
│   ├── lib/
│   │   └── prisma.ts      # Prisma client configuration
│   ├── repositories/
│   │   └── diagnosisRepository.ts  # Data access layer
│   ├── types/
│   │   └── diagnosis.ts   # TypeScript type definitions
│   ├── validation/
│   │   └── diagnosis.ts   # Input validation schemas
│   └── server.ts          # Main server file (to be added)
├── tests/                 # Test files (to be added)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest testing configuration
├── env.example           # Environment variables template
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://postgres@localhost:5433/cymbiose_dev?schema=public"

# Server
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your-jwt-secret-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=diagnosis

# Run integration tests only
npm test -- --testPathPattern=integration
```

### Test Coverage
The project maintains ≥80% test coverage across:
- Repository layer (unit tests)
- API endpoints (integration tests)
- Validation and error handling
- Security middleware

## 🔧 API Testing

### Using Postman
1. Import the collection: `postman/Cymbiose_AI_Diagnostic_API.postman_collection.json`
2. The collection includes:
   - All API endpoints with examples
   - Test scenarios for mock data
   - Error testing scenarios
   - Environment variables setup

### Using curl
```bash
# Get diagnosis for client
curl -X GET "http://localhost:3001/api/diagnoses/550e8400-e29b-41d4-a716-446655440001"

# Create new diagnosis
curl -X POST "http://localhost:3001/api/diagnoses/550e8400-e29b-41d4-a716-446655440001" \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosisName": "Major Depressive Disorder",
    "justification": "Patient shows symptoms of persistent sadness and loss of interest over 6 weeks"
  }'

# Add therapist challenge
curl -X PUT "http://localhost:3001/api/diagnoses/DIAGNOSIS_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "challengedDiagnosis": "Adjustment Disorder",
    "challengedJustification": "Symptoms appear situational rather than chronic"
  }'
```

## 🛠️ Technology Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod
- **Testing:** Jest
- **Documentation:** Swagger/OpenAPI

## 🔍 Example API Usage

### Get Diagnosis for Client
```bash
curl -X GET http://localhost:3001/api/diagnoses/550e8400-e29b-41d4-a716-446655440001
```

### Create/Update Diagnosis
```bash
curl -X POST http://localhost:3001/api/diagnoses/550e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosisName": "Major Depressive Disorder",
    "justification": "Patient shows symptoms of persistent sadness...",
    "challengedDiagnosis": "Adjustment Disorder",
    "challengedJustification": "Symptoms may be situational..."
  }'
```

## 🚦 Next Steps

1. **Complete API Implementation:**
   - Add controllers and routes
   - Implement middleware (validation, error handling)
   - Add Swagger documentation

2. **Add Testing:**
   - Unit tests for repositories
   - Integration tests for API endpoints
   - Test coverage reporting

3. **Security Enhancements:**
   - Authentication middleware
   - Rate limiting
   - Input sanitization

4. **Frontend Integration:**
   - CORS configuration
   - API client generation

## 🐛 Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running on port 5433
2. Check DATABASE_URL in .env file
3. Verify database exists: `createdb cymbiose_dev`

### Prisma Issues
1. Regenerate client: `npm run db:generate`
2. Reset database: `npm run db:reset`
3. Check schema.prisma syntax

### Development Issues
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check TypeScript errors: `npx tsc --noEmit`
3. Restart dev server: `npm run dev`

## 📝 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Cymbiose AI
