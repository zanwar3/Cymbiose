import { z } from 'zod';

export const createDiagnosisSchema = z.object({
  diagnosisName: z.string().min(1, 'Diagnosis name is required').max(500, 'Diagnosis name too long'),
  justification: z.string().min(1, 'Justification is required').max(2000, 'Justification too long'),
  challengedDiagnosis: z.string().max(500, 'Challenged diagnosis too long').optional(),
  challengedJustification: z.string().max(2000, 'Challenged justification too long').optional()
});

export const updateDiagnosisSchema = z.object({
  diagnosisName: z.string().min(1, 'Diagnosis name is required').max(500, 'Diagnosis name too long').optional(),
  justification: z.string().min(1, 'Justification is required').max(2000, 'Justification too long').optional(),
  challengedDiagnosis: z.string().max(500, 'Challenged diagnosis too long').optional(),
  challengedJustification: z.string().max(2000, 'Challenged justification too long').optional()
});

export const clientIdParamSchema = z.object({
  clientId: z.string().uuid('Invalid client ID format')
});

export const diagnosisIdParamSchema = z.object({
  id: z.string().cuid('Invalid diagnosis ID format')
});

// Additional validation for common patterns
export const uuidSchema = z.string().uuid();
export const cuidSchema = z.string().cuid();

// Validation helpers
export function validateUUID(value: string): boolean {
  return uuidSchema.safeParse(value).success;
}

export function validateCUID(value: string): boolean {
  return cuidSchema.safeParse(value).success;
}
