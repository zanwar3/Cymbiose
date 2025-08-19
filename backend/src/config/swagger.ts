import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cymbiose AI - Diagnostic Support API',
      version: '1.0.0',
      description: `
        API for managing AI-suggested diagnoses and therapist feedback.
        
        This API enables therapists to:
        - View AI-predicted diagnoses with justifications
        - Edit or challenge AI suggestions
        - Provide alternative diagnoses with reasoning
        - Track diagnosis history for clients
        
        **Test Project Features:**
        - Mocked AI diagnosis data
        - CRUD operations for diagnoses
        - Input validation and error handling
        - Secure by design (no PII in logs)
      `,
      contact: {
        name: 'Cymbiose AI Development Team',
        email: 'dev@cymbiose.ai',
        url: 'https://cymbiose.ai'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.cymbiose.ai',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Diagnosis: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the diagnosis (CUID)',
              example: 'clp123abc456def789'
            },
            clientId: {
              type: 'string',
              format: 'uuid',
              description: 'Client identifier',
              example: '550e8400-e29b-41d4-a716-446655440001'
            },
            diagnosisName: {
              type: 'string',
              description: 'Name of the diagnosis',
              example: 'Major Depressive Disorder'
            },
            predictedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the diagnosis was predicted',
              example: '2024-01-15T10:30:00Z'
            },
            justification: {
              type: 'string',
              description: 'AI justification for the diagnosis',
              example: 'Client presents with persistent depressed mood, loss of interest in activities, sleep disturbances, and feelings of worthlessness for the past 6 weeks. PHQ-9 score of 18 indicates moderate to severe depression.'
            },
            challengedDiagnosis: {
              type: 'string',
              nullable: true,
              description: 'Alternative diagnosis suggested by therapist',
              example: 'Adjustment Disorder with Depressed Mood'
            },
            challengedJustification: {
              type: 'string',
              nullable: true,
              description: 'Therapist justification for the challenged diagnosis',
              example: 'Symptoms appear to be more situational and related to recent job loss rather than chronic depression.'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-15T14:22:33Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          },
          required: ['id', 'clientId', 'diagnosisName', 'predictedDate', 'justification', 'updatedAt', 'createdAt']
        },
        CreateDiagnosisRequest: {
          type: 'object',
          properties: {
            diagnosisName: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Name of the diagnosis',
              example: 'Major Depressive Disorder'
            },
            justification: {
              type: 'string',
              minLength: 1,
              maxLength: 2000,
              description: 'Justification for the diagnosis',
              example: 'Patient shows symptoms of persistent sadness, loss of interest, and sleep disturbances over the past 6 weeks.'
            },
            challengedDiagnosis: {
              type: 'string',
              maxLength: 500,
              nullable: true,
              description: 'Alternative diagnosis suggested by therapist',
              example: 'Adjustment Disorder'
            },
            challengedJustification: {
              type: 'string',
              maxLength: 2000,
              nullable: true,
              description: 'Justification for the challenged diagnosis',
              example: 'Symptoms may be situational rather than chronic.'
            }
          },
          required: ['diagnosisName', 'justification']
        },
        UpdateDiagnosisRequest: {
          type: 'object',
          properties: {
            diagnosisName: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Name of the diagnosis'
            },
            justification: {
              type: 'string',
              minLength: 1,
              maxLength: 2000,
              description: 'Justification for the diagnosis'
            },
            challengedDiagnosis: {
              type: 'string',
              maxLength: 500,
              nullable: true,
              description: 'Alternative diagnosis suggested by therapist'
            },
            challengedJustification: {
              type: 'string',
              maxLength: 2000,
              nullable: true,
              description: 'Justification for the challenged diagnosis'
            }
          }
        },
        DiagnosisResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            data: {
              $ref: '#/components/schemas/Diagnosis'
            },
            message: {
              type: 'string',
              description: 'Human-readable message'
            }
          },
          required: ['success']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation error'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'diagnosisName'
                  },
                  message: {
                    type: 'string',
                    example: 'Diagnosis name is required'
                  }
                }
              }
            }
          },
          required: ['success', 'error']
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Service is healthy'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            service: {
              type: 'string',
              example: 'cymbiose-backend'
            },
            environment: {
              type: 'string',
              example: 'development'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Diagnoses',
        description: 'Operations related to AI diagnoses and therapist feedback'
      },
      {
        name: 'Health',
        description: 'Service health and monitoring endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options);
