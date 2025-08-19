# Cymbiose AI Frontend - Diagnostic Support Interface

A modern Next.js 15 frontend application for the Cymbiose AI Diagnostic Support System, built with TypeScript, Tailwind CSS, and modern React patterns.

## 🚀 Features

- **Modern Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first responsive layout with dark mode support
- **Real-time Data**: React Query for efficient API state management
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Custom shadcn/ui-inspired component library
- **API Integration**: Full integration with Cymbiose AI backend APIs
- **Error Handling**: Comprehensive error handling and loading states
- **Accessibility**: WCAG-compliant components with proper ARIA labels

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:3001
- Git

## 🚀 Quick Start

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── diagnoses/
│   │   ├── create/              # Create diagnosis page
│   │   ├── edit/[id]/           # Edit diagnosis page
│   │   └── history/             # Diagnosis history page
│   ├── clients/                 # Client management page
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Dashboard homepage
│   └── globals.css              # Global styles and CSS variables
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── loading.tsx
│   │   └── ...
│   ├── client-selector.tsx      # Client selection component
│   ├── diagnosis-card.tsx       # Diagnosis display component
│   ├── diagnosis-form.tsx       # Diagnosis form component
│   └── theme-toggle.tsx         # Dark mode toggle
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client and endpoints
│   ├── hooks.ts                 # React Query hooks
│   ├── providers.tsx            # App providers (React Query, etc.)
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
└── package.json                 # Dependencies and scripts
```

## 🔌 API Integration

### Endpoints Used

- `GET /health` - Health check
- `GET /api/diagnoses/:clientId` - Get latest diagnosis
- `POST /api/diagnoses/:clientId` - Create/update diagnosis
- `PUT /api/diagnoses/:id` - Update diagnosis by ID
- `GET /api/diagnoses/by-id/:id` - Get diagnosis by ID
- `GET /api/diagnoses/:clientId/history` - Get diagnosis history

### API Client Features

- Automatic error handling and retry logic
- Request/response interceptors
- TypeScript type safety
- Timeout configuration
- Loading states and error boundaries

## 🎨 UI Components

### Base Components
- **Button**: Various variants (default, outline, ghost, destructive)
- **Card**: Container component with header, content, footer
- **Input/Textarea**: Form input components with validation states
- **Badge**: Status indicators and labels
- **Loading**: Spinner and loading state components

### Feature Components
- **DiagnosisForm**: Complete form for creating/editing diagnoses
- **DiagnosisCard**: Display component for diagnosis information
- **ClientSelector**: Client selection interface
- **ThemeToggle**: Dark/light mode toggle

## 📱 Pages

### Dashboard (`/`)
- Overview statistics
- Client selection
- Latest diagnosis display
- Quick actions

### Clients (`/clients`)
- Client list with search
- Client cards with diagnosis status
- Quick access to client actions

### Create Diagnosis (`/diagnoses/create`)
- Client selection
- Diagnosis form with AI and therapist sections
- Validation and error handling

### Edit Diagnosis (`/diagnoses/edit/[id]`)
- Pre-filled form with existing data
- Update functionality
- Breadcrumb navigation

### Diagnosis History (`/diagnoses/history`)
- Paginated diagnosis list
- Filtering by client
- Historical timeline view

## 🎯 Key Features

### Client Management
- Mock client data for demonstration
- Client search and filtering
- Quick client switching

### Diagnosis Management
- Create new AI diagnoses
- Add therapist challenges/feedback
- Edit existing diagnoses
- View complete history

### Form Validation
- Zod schema validation
- Real-time error feedback
- Field-level validation
- Form state management

### Responsive Design
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly interactions
- Accessible navigation

### Dark Mode
- System preference detection
- Manual toggle
- Persistent user preference
- Smooth transitions

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 🌐 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_APP_NAME=Cymbiose AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🧪 Development Workflow

1. **Start Backend**: Ensure the backend API is running on port 3001
2. **Start Frontend**: Run `npm run dev` to start the development server
3. **Hot Reload**: Changes are automatically reflected in the browser
4. **Type Safety**: TypeScript provides compile-time error checking
5. **API Testing**: Use React Query Devtools to inspect API calls

## 📊 State Management

### React Query Configuration
- Automatic background refetching
- Intelligent caching strategies
- Error retry logic
- Loading state management
- Optimistic updates

### Query Keys
```typescript
queryKeys = {
  diagnosis: (clientId: string) => ['diagnosis', clientId],
  diagnosisHistory: (clientId: string, page: number, limit: number) => 
    ['diagnosis-history', clientId, page, limit],
  diagnosisById: (diagnosisId: string) => ['diagnosis-by-id', diagnosisId],
}
```

## 🎨 Styling System

### Design Tokens
- CSS custom properties for theming
- Consistent color palette
- Typography scale
- Spacing system
- Border radius values

### Responsive Breakpoints
```css
sm: '640px'   # Small devices
md: '768px'   # Medium devices  
lg: '1024px'  # Large devices
xl: '1280px'  # Extra large devices
```

## 🚦 Error Handling

- API error boundaries
- Form validation errors
- Loading state management
- User-friendly error messages
- Retry mechanisms

## 🔍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Contributing

1. Follow TypeScript best practices
2. Use the established component patterns
3. Maintain responsive design principles
4. Add proper error handling
5. Include loading states
6. Write accessible markup

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running on port 3001
   - Check CORS configuration
   - Verify environment variables

2. **Build Errors**
   - Run `npm run type-check` for TypeScript errors
   - Check for missing dependencies
   - Verify import paths

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes
   - Verify dark mode setup

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Cymbiose AI - Modern healthcare technology solutions.