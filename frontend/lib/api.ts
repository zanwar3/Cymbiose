import axios, { AxiosError } from 'axios';
import type {
  Diagnosis,
  DiagnosisResponse,
  DiagnosisListResponse,
  CreateDiagnosisRequest,
  UpdateDiagnosisRequest,
  HealthResponse,
  ApiError,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health check
export const healthCheck = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};

// Diagnosis API functions
export const diagnosisApi = {
  // Get latest diagnosis for a client
  getLatestDiagnosis: async (clientId: string): Promise<Diagnosis | null> => {
    try {
      const response = await api.get<DiagnosisResponse>(`/api/diagnoses/${clientId}`);
      return response.data.data || null;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create or update diagnosis
  createOrUpdateDiagnosis: async (
    clientId: string,
    data: CreateDiagnosisRequest
  ): Promise<Diagnosis> => {
    const response = await api.post<DiagnosisResponse>(
      `/api/diagnoses/${clientId}`,
      data
    );
    if (!response.data.data) {
      throw new Error('Failed to create/update diagnosis');
    }
    return response.data.data;
  },

  // Update diagnosis by ID
  updateDiagnosis: async (
    diagnosisId: string,
    data: UpdateDiagnosisRequest
  ): Promise<Diagnosis> => {
    const response = await api.put<DiagnosisResponse>(
      `/api/diagnoses/${diagnosisId}`,
      data
    );
    if (!response.data.data) {
      throw new Error('Failed to update diagnosis');
    }
    return response.data.data;
  },

  // Get diagnosis by ID
  getDiagnosisById: async (diagnosisId: string): Promise<Diagnosis> => {
    const response = await api.get<DiagnosisResponse>(
      `/api/diagnoses/by-id/${diagnosisId}`
    );
    if (!response.data.data) {
      throw new Error('Diagnosis not found');
    }
    return response.data.data;
  },

  // Get diagnosis history for a client
  getDiagnosisHistory: async (
    clientId: string,
    page = 1,
    limit = 10
  ): Promise<DiagnosisListResponse> => {
    const response = await api.get<DiagnosisListResponse>(
      `/api/diagnoses/${clientId}/history`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};

// Utility function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    if (apiError?.details?.length) {
      return apiError.details.map(d => `${d.field}: ${d.message}`).join(', ');
    }
    return apiError?.error || error.message || 'An unexpected error occurred';
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred';
};

export default api;
