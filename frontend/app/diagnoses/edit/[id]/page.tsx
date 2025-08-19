'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DiagnosisForm } from '@/components/diagnosis-form';
import { LoadingState } from '@/components/ui/loading';
import { useDiagnosisById } from '@/lib/hooks';
import { getClientName } from '@/lib/utils';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

export default function EditDiagnosisPage() {
  const params = useParams();
  const router = useRouter();
  const diagnosisId = params.id as string;

  const { 
    data: diagnosis, 
    isLoading, 
    error 
  } = useDiagnosisById(diagnosisId);

  const handleSuccess = () => {
    // Redirect back to dashboard or history
    router.push(`/?clientId=${diagnosis?.clientId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Diagnosis</h1>
          <p className="text-muted-foreground">Loading diagnosis details...</p>
        </div>
        <LoadingState message="Loading diagnosis for editing..." />
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Diagnosis</h1>
            <p className="text-muted-foreground">
              Diagnosis not found or failed to load
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
                <Edit className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Diagnosis Not Found</h3>
                <p className="text-muted-foreground">
                  The diagnosis you&apos;re trying to edit doesn&apos;t exist or couldn&apos;t be loaded.
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href={`/diagnoses/history?clientId=${diagnosis.clientId}`}>
              <Button variant="ghost" size="sm">
                View History
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Diagnosis</h1>
          <p className="text-muted-foreground">
            Update diagnosis information and therapist feedback
          </p>
        </div>
      </div>

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            Editing Diagnosis for {getClientName(diagnosis.clientId)}
          </CardTitle>
          <CardDescription>
            Diagnosis ID: {diagnosis.id} • Created: {new Date(diagnosis.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Edit Form */}
      <div className="max-w-4xl">
        <DiagnosisForm
          clientId={diagnosis.clientId}
          initialData={diagnosis}
          onSuccess={handleSuccess}
          mode="edit"
        />
      </div>
    </div>
  );
}
