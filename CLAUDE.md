# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Database Setup

The application uses Supabase with PostgreSQL. Run SQL files in this order:
1. `database.sql` - Core tables (categories, expenses)
2. `gamification.sql` - Gamification features 
3. `advanced-gamification.sql` - Advanced features

## Architecture Overview

### Core Structure
- **Next.js 15 App Router**: Routes defined in `src/app/` with nested layouts
- **Supabase Backend**: PostgreSQL with Row Level Security (RLS)
- **TypeScript**: Full type safety with database types generated in `src/types/database.ts`

### Key Architectural Patterns

**Service Layer Architecture**: Business logic is separated into services in `src/services/`:
- `auth.ts` - Authentication operations
- `expenses.ts` - Expense CRUD operations  
- `categories.ts` - Category management
- `gamification.ts` - Points, achievements, challenges, budget goals

**Custom Hooks**: React hooks in `src/hooks/` provide stateful logic:
- `useAuth.tsx` - Authentication state management
- `useExpenses.ts` - Expense data operations
- `useGamification.ts` - Gamification state and operations

**Database Type Safety**: The `src/types/database.ts` file contains auto-generated TypeScript types from Supabase schema, ensuring type safety across all database operations.

### Gamification System
Complex multi-table gamification system with:
- **User Profiles**: Points, streaks, levels tracked in `user_profiles`
- **Achievements**: Badge system with automatic awarding via `checkAchievements()`
- **Character System**: Virtual companions with accessories and customization
- **Challenge System**: Time-limited goals with progress tracking
- **Budget Goals**: Financial targets with gamified rewards

### State Management
- **Zustand**: Lightweight stores in `src/stores/` (though currently unused)
- **React Hook Form + Zod**: Form validation throughout the app
- **Supabase Real-time**: Live updates for collaborative features

### Component Architecture
- **UI Components**: Base components in `src/components/ui/` using Radix UI primitives
- **Feature Components**: Domain-specific components organized by feature area
- **Animation System**: Framer Motion animations in `src/components/animations/`

### Authentication Flow
Uses Supabase Auth with middleware protection. The `middleware.ts` file handles route protection and authentication state.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Files for Understanding

- `src/types/database.ts` - Complete database schema types
- `src/services/gamification.ts` - Core gamification business logic
- `src/lib/supabase/` - Database client configuration
- `middleware.ts` - Route protection and auth
- `src/constants/gamification.ts` - Level system and game constants



## Code Refactoring Standards

### Component Extraction Principles
When refactoring pages and components, follow these standards:

#### 1. Single Responsibility Principle (SRP)
- **Components**: Each component should handle one UI concern
- **Hooks**: Each custom hook should manage one piece of state or logic  
- **Utilities**: Each utility function should perform one specific task
- **API modules**: Each module should handle one domain's API calls

#### 2. File Size Constraints
- **Maximum 150 lines per file** - If exceeded, split into smaller, focused modules
- Break large components into smaller sub-components
- Extract complex logic into custom hooks or utility functions
- Split large API modules by feature or resource type

#### 3. Reusable Component Creation
When extracting components from pages, create them in appropriate locations:

**UI Components** (`src/components/ui/`):
- **Atomic UI elements**: Buttons, inputs, cards, dialogs
- **Layout components**: Headers, sections, containers
- **Display components**: Stat cards, loading states, empty states
- **Form components**: Specialized input variants, form layouts

**Shared Hooks** (`src/hooks/`):
- **State management**: Form handling, UI state, data fetching
- **Business logic**: Authentication, validation, API interactions
- **Utility hooks**: Date formatting, responsive behavior, confirmation dialogs

#### 4. Component Design Standards
- **Props Interface**: Always define clear TypeScript interfaces
- **Default Values**: Provide sensible defaults for optional props
- **Composition**: Prefer composition over inheritance
- **Flexibility**: Make components configurable via props
- **Consistency**: Follow existing naming conventions and patterns

#### 5. Hook Design Standards
- **Single Concern**: Each hook should manage one aspect of logic
- **Return Objects**: Return objects with descriptive property names
- **Loading States**: Include loading/error states where applicable
- **Memoization**: Use useMemo/useCallback for expensive operations
- **Dependencies**: Clearly document dependencies in effect arrays

#### 6. Refactoring Process
1. **Analyze**: Identify repeated patterns, large components, complex logic
2. **Extract**: Create reusable components and hooks
3. **Replace**: Update original pages to use extracted components
4. **Test**: Ensure functionality remains intact
5. **Clean**: Remove unused code and imports

### Implementation Examples

#### Page Header Pattern
```tsx
// Before: Inline header in every page
<div className="flex justify-between items-center">
  <div>
    <h1>Page Title</h1>
    <p>Page description</p>
  </div>
  <Button>Action</Button>
</div>

// After: Reusable PageHeader component
<PageHeader 
  title="Page Title"
  subtitle="Page description" 
  actions={<Button>Action</Button>}
/>
```

#### Form Logic Pattern
```tsx
// Before: Inline form handling
const [isLoading, setIsLoading] = useState(false);
const form = useForm();
const onSubmit = async (data) => { /* logic */ };

// After: Shared hook
const { form, isLoading, onSubmit } = usePageForm({ 
  type: 'create',
  service: apiService.create 
});
```

### Styling System
- CSS custom properties for theming
- Component-specific CSS classes in `src/app/globals.css`
- **Use existing CSS classes over inline styles** - Maintain consistency
- Glass morphism and elegant shadows for premium feel
