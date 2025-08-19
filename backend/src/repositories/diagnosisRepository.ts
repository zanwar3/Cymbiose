import { Diagnosis, CreateDiagnosisRequest, UpdateDiagnosisRequest } from '../types/diagnosis';
import prisma from '../lib/prisma';

export class DiagnosisRepository {
  /**
   * Find the most recent diagnosis for a client
   */
  async findByClientId(clientId: string): Promise<Diagnosis | null> {
    try {
      return await prisma.diagnosis.findFirst({
        where: { clientId },
        orderBy: { predictedDate: 'desc' }
      });
    } catch (error) {
      console.error('Error finding diagnosis by client ID:', error);
      throw new Error('Failed to retrieve diagnosis');
    }
  }

  /**
   * Create a new diagnosis record
   */
  async create(clientId: string, data: CreateDiagnosisRequest): Promise<Diagnosis> {
    try {
      return await prisma.diagnosis.create({
        data: {
          clientId,
          diagnosisName: data.diagnosisName,
          predictedDate: new Date(),
          justification: data.justification,
          challengedDiagnosis: data.challengedDiagnosis || null,
          challengedJustification: data.challengedJustification || null
        }
      });
    } catch (error) {
      console.error('Error creating diagnosis:', error);
      throw new Error('Failed to create diagnosis');
    }
  }

  /**
   * Update an existing diagnosis record
   */
  async update(id: string, data: UpdateDiagnosisRequest): Promise<Diagnosis | null> {
    try {
      const updateData: any = {};
      
      if (data.diagnosisName !== undefined) {
        updateData.diagnosisName = data.diagnosisName;
      }
      if (data.justification !== undefined) {
        updateData.justification = data.justification;
      }
      if (data.challengedDiagnosis !== undefined) {
        updateData.challengedDiagnosis = data.challengedDiagnosis;
      }
      if (data.challengedJustification !== undefined) {
        updateData.challengedJustification = data.challengedJustification;
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('No fields to update');
      }

      return await prisma.diagnosis.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return null;
      }
      throw new Error('Failed to update diagnosis');
    }
  }

  /**
   * Find a diagnosis by its ID
   */
  async findById(id: string): Promise<Diagnosis | null> {
    try {
      return await prisma.diagnosis.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error finding diagnosis by ID:', error);
      throw new Error('Failed to retrieve diagnosis');
    }
  }

  /**
   * Get all diagnoses for a client (with pagination)
   */
  async findAllByClientId(
    clientId: string, 
    options: { skip?: number; take?: number } = {}
  ): Promise<Diagnosis[]> {
    try {
      const { skip = 0, take = 10 } = options;
      
      return await prisma.diagnosis.findMany({
        where: { clientId },
        orderBy: { predictedDate: 'desc' },
        skip,
        take
      });
    } catch (error) {
      console.error('Error finding all diagnoses by client ID:', error);
      throw new Error('Failed to retrieve diagnoses');
    }
  }

  /**
   * Delete a diagnosis record
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.diagnosis.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return false;
      }
      throw new Error('Failed to delete diagnosis');
    }
  }

  /**
   * Check if a diagnosis exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await prisma.diagnosis.count({
        where: { id }
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking diagnosis existence:', error);
      throw new Error('Failed to check diagnosis existence');
    }
  }
}

export default new DiagnosisRepository();
