import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diagnosisApi, handleApiError } from './api';
import type { CreateDiagnosisRequest, UpdateDiagnosisRequest } from './types';
import { toast } from 'sonner';

// Query keys
export const queryKeys = {
  diagnosis: (clientId: string) => ['diagnosis', clientId],
  diagnosisHistory: (clientId: string, page: number, limit: number) => 
    ['diagnosis-history', clientId, page, limit],
  diagnosisById: (diagnosisId: string) => ['diagnosis-by-id', diagnosisId],
} as const;

// Get latest diagnosis for a client
export const useLatestDiagnosis = (clientId: string) => {
  return useQuery({
    queryKey: queryKeys.diagnosis(clientId),
    queryFn: () => diagnosisApi.getLatestDiagnosis(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get diagnosis history
export const useDiagnosisHistory = (clientId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.diagnosisHistory(clientId, page, limit),
    queryFn: () => diagnosisApi.getDiagnosisHistory(clientId, page, limit),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get diagnosis by ID
export const useDiagnosisById = (diagnosisId: string) => {
  return useQuery({
    queryKey: queryKeys.diagnosisById(diagnosisId),
    queryFn: () => diagnosisApi.getDiagnosisById(diagnosisId),
    enabled: !!diagnosisId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create or update diagnosis mutation
export const useCreateOrUpdateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: CreateDiagnosisRequest }) =>
      diagnosisApi.createOrUpdateDiagnosis(clientId, data),
    onSuccess: (diagnosis) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnosis(diagnosis.clientId) });
      queryClient.invalidateQueries({ queryKey: ['diagnosis-history', diagnosis.clientId] });
      toast.success('Diagnosis saved successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to save diagnosis: ${message}`);
    },
  });
};

// Update diagnosis mutation
export const useUpdateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ diagnosisId, data }: { diagnosisId: string; data: UpdateDiagnosisRequest }) =>
      diagnosisApi.updateDiagnosis(diagnosisId, data),
    onSuccess: (diagnosis) => {
      // Update specific queries
      queryClient.setQueryData(queryKeys.diagnosisById(diagnosis.id), diagnosis);
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnosis(diagnosis.clientId) });
      queryClient.invalidateQueries({ queryKey: ['diagnosis-history', diagnosis.clientId] });
      toast.success('Diagnosis updated successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update diagnosis: ${message}`);
    },
  });
};
