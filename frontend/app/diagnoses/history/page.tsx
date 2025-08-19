'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClientSelector } from '@/components/client-selector';
import { DiagnosisCard } from '@/components/diagnosis-card';
import { LoadingState } from '@/components/ui/loading';
import { useDiagnosisHistory } from '@/lib/hooks';
import { getClientName } from '@/lib/utils';
import { ArrowLeft, History, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function DiagnosisHistoryContent() {
  const searchParams = useSearchParams();
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const clientId = searchParams.get('clientId');
    if (clientId) {
      setSelectedClientId(clientId);
    }
  }, [searchParams]);

  const { 
    data: historyData, 
    isLoading, 
    error 
  } = useDiagnosisHistory(selectedClientId, currentPage, pageSize);

  const diagnoses = historyData?.data || [];
  const pagination = historyData?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Diagnosis History</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              View all diagnoses and therapist feedback over time
            </p>
          </div>

          {selectedClientId && (
            <Link href={`/diagnoses/create?clientId=${selectedClientId}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Diagnosis</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      {!selectedClientId ? (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <History className="h-5 w-5" />
                  Select Client
                </CardTitle>
                <CardDescription>
                  Choose a client to view their diagnosis history
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
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">View History</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    <span className="lg:hidden">Select a client below to see their complete diagnosis history</span>
                    <span className="hidden lg:inline">Select a client to see their complete diagnosis history</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Client Info Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{getClientName(selectedClientId)} - History</CardTitle>
                  <CardDescription>
                    Complete diagnosis history and therapist feedback
                  </CardDescription>
                </div>
                {pagination && (
                  <Badge variant="secondary">
                    {pagination.total} total diagnoses
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* History Content */}
          {isLoading ? (
            <LoadingState message="Loading diagnosis history..." />
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
                    <History className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Error Loading History</h3>
                    <p className="text-muted-foreground">
                      Failed to load diagnosis history. Please try again.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : diagnoses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                    <History className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No History Found</h3>
                    <p className="text-muted-foreground">
                      This client doesn&apos;t have any diagnosis history yet.
                    </p>
                  </div>
                  <Link href={`/diagnoses/create?clientId=${selectedClientId}`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Diagnosis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Diagnosis List */}
              <div className="space-y-4">
                {diagnoses.map((diagnosis) => (
                  <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    clientName={getClientName(selectedClientId)}
                    onEdit={() => {
                      window.location.href = `/diagnoses/edit/${diagnosis.id}`;
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="text-sm text-muted-foreground text-center sm:text-left">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} diagnoses
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="flex-shrink-0"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Prev</span>
                          </Button>
                          
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                              .filter(page => 
                                page === 1 || 
                                page === pagination.totalPages || 
                                Math.abs(page - currentPage) <= 1
                              )
                              .map((page, index, array) => (
                                <div key={page} className="flex items-center">
                                  {index > 0 && array[index - 1] !== page - 1 && (
                                    <span className="px-2 text-muted-foreground hidden sm:inline">...</span>
                                  )}
                                  <Button
                                    variant={page === currentPage ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => handlePageChange(page)}
                                    className="w-8 h-8 p-0"
                                  >
                                    {page}
                                  </Button>
                                </div>
                              ))}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= pagination.totalPages}
                            className="flex-shrink-0"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">Next</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function DiagnosisHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiagnosisHistoryContent />
    </Suspense>
  );
}
