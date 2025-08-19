import { Router } from 'express';
import diagnosisController from '../controllers/diagnosisController';
import { validateRequest } from '../middleware/validation';
import { 
  createDiagnosisSchema, 
  updateDiagnosisSchema, 
  clientIdParamSchema, 
  diagnosisIdParamSchema 
} from '../validation/diagnosis';

const router = Router();

/**
 * @swagger
 * /api/diagnoses/health:
 *   get:
 *     summary: Health check for diagnosis service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/health', diagnosisController.healthCheck);

/**
 * @swagger
 * /api/diagnoses/{clientId}:
 *   get:
 *     summary: Get the latest diagnosis for a specific client
 *     description: Retrieves the most recent diagnosis record for the specified client ID
 *     tags: [Diagnoses]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Client UUID
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Diagnosis retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiagnosisResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "clp123abc456def789"
 *                 clientId: "550e8400-e29b-41d4-a716-446655440001"
 *                 diagnosisName: "Major Depressive Disorder"
 *                 predictedDate: "2024-01-15T10:30:00Z"
 *                 justification: "Client presents with persistent depressed mood..."
 *                 challengedDiagnosis: null
 *                 challengedJustification: null
 *                 updatedAt: "2024-01-15T14:22:33Z"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *               message: "Diagnosis retrieved successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:clientId', 
  validateRequest(clientIdParamSchema, 'params'),
  diagnosisController.getDiagnosisByClientId
);

/**
 * @swagger
 * /api/diagnoses/{clientId}/history:
 *   get:
 *     summary: Get diagnosis history for a client
 *     description: Retrieves paginated diagnosis history for the specified client
 *     tags: [Diagnoses]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Client UUID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Diagnosis history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Diagnosis'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:clientId/history',
  validateRequest(clientIdParamSchema, 'params'),
  diagnosisController.getDiagnosisHistory
);

/**
 * @swagger
 * /api/diagnoses/{clientId}:
 *   post:
 *     summary: Create or update diagnosis for a client
 *     description: Creates a new diagnosis if none exists, or updates the existing one for the specified client
 *     tags: [Diagnoses]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Client UUID
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiagnosisRequest'
 *           example:
 *             diagnosisName: "Major Depressive Disorder"
 *             justification: "Client presents with persistent depressed mood, loss of interest in activities, sleep disturbances, and feelings of worthlessness for the past 6 weeks. PHQ-9 score of 18 indicates moderate to severe depression."
 *             challengedDiagnosis: "Adjustment Disorder with Depressed Mood"
 *             challengedJustification: "Symptoms may be more situational and related to recent life stressors rather than chronic depression."
 *     responses:
 *       200:
 *         description: Diagnosis updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiagnosisResponse'
 *       201:
 *         description: Diagnosis created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiagnosisResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/:clientId',
  validateRequest(clientIdParamSchema, 'params'),
  validateRequest(createDiagnosisSchema, 'body'),
  diagnosisController.createOrUpdateDiagnosis
);

/**
 * @swagger
 * /api/diagnoses/by-id/{id}:
 *   get:
 *     summary: Get a specific diagnosis by ID
 *     description: Retrieves a diagnosis record by its unique identifier
 *     tags: [Diagnoses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Diagnosis ID (CUID)
 *         example: "clp123abc456def789"
 *     responses:
 *       200:
 *         description: Diagnosis retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiagnosisResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/by-id/:id',
  validateRequest(diagnosisIdParamSchema, 'params'),
  diagnosisController.getDiagnosisById
);

/**
 * @swagger
 * /api/diagnoses/{id}:
 *   put:
 *     summary: Update an existing diagnosis by ID
 *     description: Updates a specific diagnosis record. All fields are optional - only provided fields will be updated.
 *     tags: [Diagnoses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Diagnosis ID (CUID)
 *         example: "clp123abc456def789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDiagnosisRequest'
 *           examples:
 *             update_challenge:
 *               summary: Add therapist challenge
 *               value:
 *                 challengedDiagnosis: "Adjustment Disorder"
 *                 challengedJustification: "Patient's symptoms appear to be more situational rather than chronic."
 *             update_diagnosis:
 *               summary: Update AI diagnosis
 *               value:
 *                 diagnosisName: "Persistent Depressive Disorder"
 *                 justification: "Updated assessment shows chronic, less severe symptoms over 2+ years."
 *     responses:
 *       200:
 *         description: Diagnosis updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiagnosisResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id',
  validateRequest(diagnosisIdParamSchema, 'params'),
  validateRequest(updateDiagnosisSchema, 'body'),
  diagnosisController.updateDiagnosis
);

export default router;
