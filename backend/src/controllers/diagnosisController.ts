import { Request, Response, NextFunction } from 'express';
import diagnosisRepository from '../repositories/diagnosisRepository';
import { DiagnosisResponse } from '../types/diagnosis';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';

export class DiagnosisController {
  /**
   * Get the latest diagnosis for a specific client
   * GET /api/diagnoses/:clientId
   */
  async getDiagnosisByClientId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clientId } = req.params;
      
      const diagnosis = await diagnosisRepository.findByClientId(clientId);
      
      if (!diagnosis) {
        throw new NotFoundError('No diagnosis found for this client');
      }

      const response: DiagnosisResponse = {
        success: true,
        data: diagnosis,
        message: 'Diagnosis retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new diagnosis or update existing one for a client
   * POST /api/diagnoses/:clientId
   */
  async createOrUpdateDiagnosis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clientId } = req.params;
      const diagnosisData = req.body;

      // Check if diagnosis already exists for this client
      const existingDiagnosis = await diagnosisRepository.findByClientId(clientId);
      
      let result;
      let statusCode;
      let message;

      if (existingDiagnosis) {
        // Update existing diagnosis
        result = await diagnosisRepository.update(existingDiagnosis.id, diagnosisData);
        statusCode = 200;
        message = 'Diagnosis updated successfully';
      } else {
        // Create new diagnosis
        result = await diagnosisRepository.create(clientId, diagnosisData);
        statusCode = 201;
        message = 'Diagnosis created successfully';
      }

      if (!result) {
        throw new ValidationError('Failed to create or update diagnosis');
      }

      const response: DiagnosisResponse = {
        success: true,
        data: result,
        message
      };

      res.status(statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing diagnosis by ID
   * PUT /api/diagnoses/:id
   */
  async updateDiagnosis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if diagnosis exists
      const existingDiagnosis = await diagnosisRepository.findById(id);
      if (!existingDiagnosis) {
        throw new NotFoundError('Diagnosis not found');
      }

      const result = await diagnosisRepository.update(id, updateData);
      
      if (!result) {
        throw new ValidationError('Failed to update diagnosis');
      }

      const response: DiagnosisResponse = {
        success: true,
        data: result,
        message: 'Diagnosis updated successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all diagnoses for a client (with pagination)
   * GET /api/diagnoses/:clientId/history
   */
  async getDiagnosisHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clientId } = req.params;
      const { page = '1', limit = '10' } = req.query;
      
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string))); // Max 50 per page
      
      const skip = (pageNum - 1) * limitNum;
      
      const diagnoses = await diagnosisRepository.findAllByClientId(clientId, {
        skip,
        take: limitNum
      });

      res.status(200).json({
        success: true,
        data: diagnoses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: diagnoses.length
        },
        message: 'Diagnosis history retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific diagnosis by ID
   * GET /api/diagnoses/by-id/:id
   */
  async getDiagnosisById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const diagnosis = await diagnosisRepository.findById(id);
      
      if (!diagnosis) {
        throw new NotFoundError('Diagnosis not found');
      }

      const response: DiagnosisResponse = {
        success: true,
        data: diagnosis,
        message: 'Diagnosis retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check for diagnosis service
   * GET /api/diagnoses/health
   */
  async healthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Simple health check - try to count diagnoses
      const exists = await diagnosisRepository.exists('test-id-that-should-not-exist');
      
      res.status(200).json({
        success: true,
        message: 'Diagnosis service is healthy',
        timestamp: new Date().toISOString(),
        service: 'diagnosis-api',
        database: 'connected'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DiagnosisController();
