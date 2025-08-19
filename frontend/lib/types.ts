// API Types based on backend
export interface Diagnosis {
  id: string;
  clientId: string;
  diagnosisName: string;
  predictedDate: string;
  justification: string;
  challengedDiagnosis?: string;
  challengedJustification?: string;
  createdAt: string;
  updatedAt: string;
}

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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
  database: {
    status: string;
    latency?: number;
  };
  version: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// UI Types
export interface Client {
  id: string;
  name: string;
  email?: string;
}

export interface FormState {
  isLoading: boolean;
  error?: string;
  success?: boolean;
}
