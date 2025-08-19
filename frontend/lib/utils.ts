import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatDateShort = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Mock client data for demo purposes
export const mockClients = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'David Thompson',
    email: 'david.thompson@email.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
  },
];

// Get client name by ID
export const getClientName = (clientId: string): string => {
  const client = mockClients.find(c => c.id === clientId);
  return client?.name || 'Unknown Client';
};

// Truncate text utility
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
