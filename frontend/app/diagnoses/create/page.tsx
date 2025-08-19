'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DiagnosisForm } from '@/components/diagnosis-form';
import { ClientSelector } from '@/components/client-selector';
import { getClientName } from '@/lib/utils';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

function CreateDiagnosisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  useEffect(() => {
    const clientId = searchParams.get('clientId');
    if (clientId) {
      setSelectedClientId(clientId);
    }
  }, [searchParams]);

  const handleSuccess = () => {
    // Redirect to dashboard or client's diagnosis history
    router.push(`/?clientId=${selectedClientId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Diagnosis</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Generate a new AI diagnosis and add therapist feedback
          </p>
        </div>
      </div>

      {/* Main Content */}
      {!selectedClientId ? (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Plus className="h-5 w-5" />
                  Select Client
                </CardTitle>
                <CardDescription>
                  Choose a client to create a diagnosis for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientSelector
                  selectedClientId={selectedClientId}
                  onClientSelect={setSelectedClientId}
                  showSelectedClient={false}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="order-1 lg:order-2">
            <Card className="h-full flex items-center justify-center min-h-[200px] lg:min-h-0">
              <CardContent className="text-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ready to Create</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    <span className="lg:hidden">Select a client below to start creating a new diagnosis</span>
                    <span className="hidden lg:inline">Select a client from the left to start creating a new diagnosis</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Creating Diagnosis for {getClientName(selectedClientId)}</CardTitle>
              <CardDescription>
                Fill out the form below to create a new diagnosis entry
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Diagnosis Form */}
          <div className="max-w-4xl">
            <DiagnosisForm
              clientId={selectedClientId}
              onSuccess={handleSuccess}
              mode="create"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateDiagnosisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateDiagnosisContent />
    </Suspense>
  );
}
