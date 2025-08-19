import { Diagnosis as PrismaDiagnosis } from '@prisma/client';

export type Diagnosis = PrismaDiagnosis;

export interface CreateDiagnosisRequest {
  diagnosisName: string;
  justification: string;
  challengedDiagnosis?: string;
  challengedJustification?: string;
}

export interface UpdateDiagnosisRequest {
  diagnosisName?: string;
  justification?: string;
  challengedDiagnosis?: string;
  challengedJustification?: string;
}

export interface DiagnosisResponse {
  success: boolean;
  data?: Diagnosis;
  error?: string;
  message?: string;
}

export interface DiagnosisListResponse {
  success: boolean;
  data?: Diagnosis[];
  error?: string;
  message?: string;
}
