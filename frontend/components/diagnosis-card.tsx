'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateShort } from '@/lib/utils';
import { Edit, Calendar, User, AlertTriangle } from 'lucide-react';
import type { Diagnosis } from '@/lib/types';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  clientName?: string;
  onEdit?: () => void;
  showClientName?: boolean;
  compact?: boolean;
}

export function DiagnosisCard({ 
  diagnosis, 
  clientName,
  onEdit, 
  showClientName = false, 
  compact = false 
}: DiagnosisCardProps) {
  const hasChallenge = diagnosis.challengedDiagnosis || diagnosis.challengedJustification;
  
  return (
    <Card className="w-full">
      <CardHeader className={compact ? 'pb-3' : ''}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} break-words`}>
              {diagnosis.diagnosisName}
            </CardTitle>
            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {compact ? formatDateShort(diagnosis.predictedDate) : formatDate(diagnosis.predictedDate)}
              </span>
              {showClientName && clientName && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {clientName}
                </span>
              )}
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {hasChallenge && (
              <Badge variant="warning" className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start">
                <AlertTriangle className="h-3 w-3" />
                Challenged
              </Badge>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} className="w-full sm:w-auto">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI Diagnosis Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300">
            AI Diagnosis
          </h4>
          <p className={`text-sm text-muted-foreground ${compact ? 'line-clamp-2' : ''}`}>
            {diagnosis.justification}
          </p>
        </div>

        {/* Therapist Challenge Section */}
        {hasChallenge && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="font-semibold text-sm text-orange-700 dark:text-orange-300">
              Therapist Feedback
            </h4>
            
            {diagnosis.challengedDiagnosis && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Alternative Diagnosis:</p>
                <p className="text-sm text-muted-foreground">
                  {diagnosis.challengedDiagnosis}
                </p>
              </div>
            )}
            
            {diagnosis.challengedJustification && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Reasoning:</p>
                <p className={`text-sm text-muted-foreground ${compact ? 'line-clamp-2' : ''}`}>
                  {diagnosis.challengedJustification}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        {!compact && (
          <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
            <span>Created: {formatDateShort(diagnosis.createdAt)}</span>
            <span>Updated: {formatDateShort(diagnosis.updatedAt)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
