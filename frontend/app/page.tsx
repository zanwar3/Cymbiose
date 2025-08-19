'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClientSelector } from '@/components/client-selector';
import { DiagnosisCard } from '@/components/diagnosis-card';
import { LoadingState } from '@/components/ui/loading';
import { useLatestDiagnosis } from '@/lib/hooks';
import { getClientName } from '@/lib/utils';
import { Plus, Activity, Users, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  const { 
    data: latestDiagnosis, 
    isLoading, 
    error 
  } = useLatestDiagnosis(selectedClientId);

  const stats = [
    {
      title: 'Total Clients',
      value: '5',
      description: 'Active clients in system',
      icon: Users,
      trend: '+2 this month',
    },
    {
      title: 'Diagnoses Created',
      value: '23',
      description: 'AI diagnoses generated',
      icon: Activity,
      trend: '+5 this week',
    },
    {
      title: 'Challenges Submitted',
      value: '8',
      description: 'Therapist feedback received',
      icon: FileText,
      trend: '34% challenge rate',
    },
    {
      title: 'Accuracy Rate',
      value: '87%',
      description: 'AI diagnostic accuracy',
      icon: TrendingUp,
      trend: '+3% improvement',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Cymbiose AI Diagnostic Support System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Client Selection */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ClientSelector
            selectedClientId={selectedClientId}
            onClientSelect={setSelectedClientId}
            showSelectedClient={false}
          />
        </div>

        {/* Client Diagnosis Display */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          {!selectedClientId ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Select a Client</h3>
                  <p className="text-muted-foreground">
                    Choose a client from the left panel to view their latest diagnosis
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Client Header */}
              <Card>
                <CardHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg sm:text-xl">{getClientName(selectedClientId)}</CardTitle>
                        <CardDescription className="mt-2">
                          Latest diagnosis and therapist feedback
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Link href={`/diagnoses/create?clientId=${selectedClientId}`} className="w-full sm:w-auto">
                          <Button size="sm" className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-1" />
                            New Diagnosis
                          </Button>
                        </Link>
                        <Link href={`/diagnoses/history?clientId=${selectedClientId}`} className="w-full sm:w-auto">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            View History
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Latest Diagnosis */}
              {isLoading ? (
                <LoadingState message="Loading latest diagnosis..." />
              ) : error ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
                        <Activity className="h-8 w-8 text-destructive" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Error Loading Diagnosis</h3>
                        <p className="text-muted-foreground">
                          Failed to load the latest diagnosis. Please try again.
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
              ) : latestDiagnosis ? (
                <DiagnosisCard
                  diagnosis={latestDiagnosis}
                  clientName={getClientName(selectedClientId)}
                  onEdit={() => {
                    window.location.href = `/diagnoses/edit/${latestDiagnosis.id}`;
                  }}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">No Diagnosis Found</h3>
                        <p className="text-muted-foreground">
                          This client doesn&apos;t have any diagnoses yet.
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}