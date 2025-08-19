'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLatestDiagnosis } from '@/lib/hooks';
import { mockClients } from '@/lib/utils';
import { User, Search, Plus, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

function ClientCard({ client }: { client: typeof mockClients[0] }) {
  const { data: latestDiagnosis, isLoading } = useLatestDiagnosis(client.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <CardDescription>{client.email}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Diagnosis Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Latest Diagnosis</h4>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : latestDiagnosis ? (
            <div className="space-y-1">
              <p className="text-sm font-medium">{latestDiagnosis.diagnosisName}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(latestDiagnosis.predictedDate).toLocaleDateString()}
              </div>
              {latestDiagnosis.challengedDiagnosis && (
                <Badge variant="warning" className="text-xs">
                  Has Challenge
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No diagnoses yet</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          <Link href={`/?clientId=${client.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Activity className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">View Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Button>
          </Link>
          <Link href={`/diagnoses/create?clientId=${client.id}`} className="flex-1 sm:flex-none">
            <Button size="sm" className="w-full">
              <Plus className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">New Diagnosis</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          Manage your clients and their diagnoses
        </p>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Badge variant="secondary">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {searchTerm ? 'No clients found' : 'No clients yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? `No clients match "${searchTerm}". Try a different search term.`
                    : 'Start by adding your first client to the system.'
                  }
                </p>
              </div>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
