'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { useCreateOrUpdateDiagnosis, useUpdateDiagnosis } from '@/lib/hooks';
import type { Diagnosis } from '@/lib/types';

const diagnosisFormSchema = z.object({
  diagnosisName: z.string().min(1, 'Diagnosis name is required').max(500, 'Diagnosis name too long'),
  justification: z.string().min(1, 'Justification is required').max(2000, 'Justification too long'),
  challengedDiagnosis: z.string().max(500, 'Challenged diagnosis too long').optional(),
  challengedJustification: z.string().max(2000, 'Challenged justification too long').optional(),
});

type DiagnosisFormData = z.infer<typeof diagnosisFormSchema>;

interface DiagnosisFormProps {
  clientId: string;
  initialData?: Diagnosis | null;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

export function DiagnosisForm({ clientId, initialData, onSuccess, mode = 'create' }: DiagnosisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createOrUpdateMutation = useCreateOrUpdateDiagnosis();
  const updateMutation = useUpdateDiagnosis();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DiagnosisFormData>({
    resolver: zodResolver(diagnosisFormSchema),
    defaultValues: {
      diagnosisName: initialData?.diagnosisName || '',
      justification: initialData?.justification || '',
      challengedDiagnosis: initialData?.challengedDiagnosis || '',
      challengedJustification: initialData?.challengedJustification || '',
    },
  });

  const onSubmit = async (data: DiagnosisFormData) => {
    setIsSubmitting(true);
    
    try {
      if (mode === 'edit' && initialData?.id) {
        await updateMutation.mutateAsync({
          diagnosisId: initialData.id,
          data,
        });
      } else {
        await createOrUpdateMutation.mutateAsync({
          clientId,
          data,
        });
      }
      
      if (mode === 'create') {
        reset();
      }
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'edit' ? 'Edit Diagnosis' : 'Create New Diagnosis'}
        </CardTitle>
        <CardDescription>
          {mode === 'edit' 
            ? 'Update the diagnosis information and therapist feedback'
            : 'Enter AI diagnosis details and optional therapist feedback'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* AI Diagnosis Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Diagnosis</h3>
            
            <div className="space-y-2">
              <label htmlFor="diagnosisName" className="text-sm font-medium">
                Diagnosis Name *
              </label>
              <Input
                id="diagnosisName"
                {...register('diagnosisName')}
                placeholder="e.g., Major Depressive Disorder"
                className={errors.diagnosisName ? 'border-destructive' : ''}
              />
              {errors.diagnosisName && (
                <p className="text-sm text-destructive">{errors.diagnosisName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="justification" className="text-sm font-medium">
                AI Justification *
              </label>
              <Textarea
                id="justification"
                {...register('justification')}
                placeholder="Explain the reasoning behind the AI diagnosis..."
                rows={4}
                className={errors.justification ? 'border-destructive' : ''}
              />
              {errors.justification && (
                <p className="text-sm text-destructive">{errors.justification.message}</p>
              )}
            </div>
          </div>

          {/* Therapist Challenge Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Therapist Feedback (Optional)</h3>
            
            <div className="space-y-2">
              <label htmlFor="challengedDiagnosis" className="text-sm font-medium">
                Alternative Diagnosis
              </label>
              <Input
                id="challengedDiagnosis"
                {...register('challengedDiagnosis')}
                placeholder="e.g., Adjustment Disorder"
                className={errors.challengedDiagnosis ? 'border-destructive' : ''}
              />
              {errors.challengedDiagnosis && (
                <p className="text-sm text-destructive">{errors.challengedDiagnosis.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="challengedJustification" className="text-sm font-medium">
                Therapist Reasoning
              </label>
              <Textarea
                id="challengedJustification"
                {...register('challengedJustification')}
                placeholder="Explain why you disagree with the AI diagnosis..."
                rows={4}
                className={errors.challengedJustification ? 'border-destructive' : ''}
              />
              {errors.challengedJustification && (
                <p className="text-sm text-destructive">{errors.challengedJustification.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 w-full sm:w-auto"
            >
              {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
              {mode === 'edit' ? 'Update Diagnosis' : 'Save Diagnosis'}
            </Button>
            
            {mode === 'create' && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => reset()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Clear Form
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
