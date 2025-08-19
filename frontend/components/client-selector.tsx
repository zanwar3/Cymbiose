'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Users, ArrowRight } from 'lucide-react';
import { mockClients } from '@/lib/utils';


interface ClientSelectorProps {
  selectedClientId?: string;
  onClientSelect: (clientId: string) => void;
  showSelectedClient?: boolean;
}

export function ClientSelector({ 
  selectedClientId, 
  onClientSelect, 
  showSelectedClient = true 
}: ClientSelectorProps) {
  const [tempSelectedId, setTempSelectedId] = useState(selectedClientId || '');
  
  const selectedClient = mockClients.find(c => c.id === selectedClientId);

  const handleSelectClient = () => {
    if (tempSelectedId && tempSelectedId !== selectedClientId) {
      onClientSelect(tempSelectedId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Selection Display */}
      {showSelectedClient && selectedClient && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{selectedClient.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{selectedClient.email}</p>
                </div>
              </div>
              <Badge variant="secondary" className="w-full sm:w-auto justify-center sm:justify-start">Active Client</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Client
          </CardTitle>
          <CardDescription>
            Choose a client to view or manage their diagnoses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="client-select" className="text-sm font-medium">
              Client
            </label>
            <Select
              id="client-select"
              value={tempSelectedId}
              onChange={(e) => setTempSelectedId(e.target.value)}
              placeholder="Select a client..."
            >
              {mockClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </Select>
          </div>

          <Button 
            onClick={handleSelectClient}
            disabled={!tempSelectedId || tempSelectedId === selectedClientId}
            className="w-full"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            {selectedClientId ? 'Switch Client' : 'Select Client'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Client List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Select</CardTitle>
          <CardDescription>
            Click on any client to select them directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {mockClients.map((client) => (
              <Button
                key={client.id}
                variant={selectedClientId === client.id ? "default" : "ghost"}
                className="justify-start h-auto p-3 w-full"
                onClick={() => onClientSelect(client.id)}
              >
                <div className="flex items-center space-x-3 w-full min-w-0">
                  <div className="p-1 bg-primary/10 rounded-full flex-shrink-0">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                  </div>
                  {selectedClientId === client.id && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">Selected</Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
