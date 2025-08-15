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



## Code Refactoring Guidelines

### Single Responsibility Principle (SRP)
When refactoring code, ensure each file and function has a single, well-defined responsibility:

- **Components**: Each component should handle one UI concern
- **Hooks**: Each custom hook should manage one piece of state or logic
- **Utilities**: Each utility function should perform one specific task
- **API modules**: Each module should handle one domain's API calls


### File Size Constraints
- **Maximum 150 lines per file** - If a file exceeds this, split it into smaller, focused modules
- Break large components into smaller sub-components
- Extract complex logic into custom hooks or utility functions
- Split large API modules by feature or resource type

### Styling System
- CSS custom properties for theming
- Material-UI integration for complex components
- Component-specific CSS modules where needed
- **Use CSS classes from index.css instead of inline styles** - Maintain consistency and reusability
