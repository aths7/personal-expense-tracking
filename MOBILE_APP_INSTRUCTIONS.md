# React Native Mobile App Development Instructions

## Overview

Create a React Native mobile app that mirrors the functionality of the existing Next.js web application. The app should connect to the same Supabase backend and maintain feature parity with the web version.

## Tech Stack Requirements

- **React Native** (latest stable version)
- **TypeScript** for type safety
- **Supabase** for backend services (same instance as web app)
- **React Navigation** for navigation
- **React Hook Form + Zod** for form validation
- **React Native Paper** or **NativeBase** for UI components
- **React Native Toast Message** for notifications

## Color Scheme (MANDATORY)

Use this exact color palette throughout the app:

```
Primary: #CCCCFF
Secondary: #A3A3CC
Tertiary: #5C5C99
Dark: #292966
```

Implement light themes with these colors as the foundation.

## Core Features to Implement

### 1. Authentication System (OTP-Based)

**Files to create:**

- `src/services/auth.ts` - Supabase auth service
- `src/screens/auth/LoginScreen.tsx` - Email input for login
- `src/screens/auth/SignupScreen.tsx` - Email input for signup
- `src/screens/auth/VerifyOtpScreen.tsx` - 6-digit OTP verification
- `src/components/auth/OtpInput.tsx` - Custom OTP input component
- `src/hooks/useAuthForm.ts` - Shared auth form logic

**Authentication Flow:**

1. User enters email on login/signup screen
2. System sends OTP via Supabase `signInWithOtp`
3. User enters 6-digit code on verification screen
4. Auto-submit when 6 digits entered + manual verify button
5. Redirect to dashboard on success

**Key Implementation Details:**

```typescript
// Supabase Auth Service
export const authService = {
  signUp: async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    return { error };
  },

  signIn: async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    return { error };
  },

  verifyOtp: async (
    email: string,
    token: string,
    type: "signup" | "magiclink"
  ) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    return { user: data.user, error };
  },
};
```

### 2. Navigation Structure

**Navigation Stack:**

```
AuthStack:
  - LoginScreen
  - SignupScreen
  - VerifyOtpScreen

AppStack (Bottom Tabs):
  - DashboardScreen
  - ExpensesScreen
  - CategoriesScreen
  - ProfileScreen
```

### 3. Dashboard Screen

**Features:**

- Stats cards showing total expenses, this month, last month, transaction count
- Recent expenses list (limit 5)
- Quick expense floating action button
- Expense charts/graphs
- Category breakdown visualization

**Components to create:**

- `src/components/dashboard/StatCard.tsx`
- `src/components/dashboard/RecentExpensesList.tsx`
- `src/components/dashboard/ExpenseCharts.tsx`
- `src/components/ui/QuickExpenseButton.tsx`

### 4. Expense Management

**Screens:**

- `src/screens/expenses/ExpensesScreen.tsx` - List all expenses
- `src/screens/expenses/AddExpenseScreen.tsx` - Add new expense
- `src/screens/expenses/EditExpenseScreen.tsx` - Edit existing expense

**Features:**

- Add expense with amount, description, category, date
- Edit/delete existing expenses
- Filter expenses by date range, category
- Search expenses by description
- Quick expense templates
- Expense modal/bottom sheet for quick add

**Components:**

- `src/components/expenses/ExpenseCard.tsx`
- `src/components/expenses/ExpenseForm.tsx`
- `src/components/expenses/ExpenseModal.tsx`
- `src/components/expenses/QuickExpenseTemplates.tsx`

### 5. Categories Management

**Screen:**

- `src/screens/categories/CategoriesScreen.tsx`

**Features:**

- View default categories (read-only)
- Create custom categories with name, color, icon
- Edit custom categories
- Delete custom categories with confirmation
- Color picker for category colors
- Icon selector for category icons

**Components:**

- `src/components/categories/CategoryCard.tsx`
- `src/components/categories/CategoryForm.tsx`
- `src/components/categories/ColorPicker.tsx`
- `src/components/categories/IconPicker.tsx`
- `src/components/ui/ConfirmDialog.tsx`

### 6. Shared Components & Hooks

**UI Components (`src/components/ui/`):**

- `LoadingSkeleton.tsx` - Loading states for cards, lists
- `EmptyState.tsx` - Empty state with icon, title, description
- `ErrorBoundary.tsx` - Error handling component
- `CustomButton.tsx` - Styled button with loading states
- `CustomInput.tsx` - Form input with validation display
- `DatePicker.tsx` - Date selection component
- `ActionSheet.tsx` - Bottom action sheet component

**Hooks (`src/hooks/`):**

- `useAuth.ts` - Authentication state management
- `useExpenses.ts` - Expense CRUD operations
- `useCategories.ts` - Category management
- `useDashboard.ts` - Dashboard statistics
- `useTheme.ts` - Theme switching functionality

**Services (`src/services/`):**

- `auth.ts` - Authentication operations
- `expenses.ts` - Expense CRUD with Supabase
- `categories.ts` - Category management
- `storage.ts` - Local storage utilities

## Database Schema

Use the existing Supabase schema from the web app:

**Tables:**

- `user_profiles` - User profile information
- `categories` - Expense categories (default + custom)
- `expenses` - Expense records with category relationships

**Row Level Security (RLS):**
Ensure all tables have proper RLS policies for user data isolation.

## Coding Standards

### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── auth/            # Auth-specific components
│   ├── dashboard/       # Dashboard components
│   ├── expenses/        # Expense components
│   └── categories/      # Category components
├── screens/             # Screen components
├── hooks/               # Custom hooks
├── services/            # API services
├── utils/               # Utility functions
├── types/               # TypeScript types
└── constants/           # App constants
```

### Component Design Principles

1. **Single Responsibility** - Each component handles one concern
2. **Max 150 lines per file** - Split larger components
3. **TypeScript interfaces** for all props
4. **Memoization** for expensive operations
5. **Error boundaries** for graceful error handling

### Code Quality

- Use TypeScript strict mode
- Implement proper error handling
- Add loading states for all async operations
- Use React Hook Form with Zod validation
- Follow React Native performance best practices
- Implement proper keyboard handling
- Add accessibility features (screen reader support)

## UI/UX Requirements

### Design System

- **Consistent spacing** - Use 4px, 8px, 16px, 24px, 32px
- **Typography** - Define text styles (heading, body, caption)
- **Elevation** - Use shadows for cards and modals
- **Animations** - Smooth transitions between screens
- **Loading states** - Skeleton screens and spinners
- **Error states** - Clear error messaging with retry options

### Mobile-Specific Features

- **Pull to refresh** on lists
- **Swipe actions** on expense items (edit/delete)
- **Bottom sheets** for forms and actions
- **Floating action button** for quick expense
- **Haptic feedback** for interactions
- **Keyboard handling** for forms
- **Safe area handling** for different devices

### Responsive Design

- Support both portrait and landscape orientations
- Handle different screen sizes (phones, tablets)
- Use responsive typography and spacing
- Proper keyboard avoidance for forms

## Implementation Priority

### Phase 1: Core Setup

1. Project setup with TypeScript and navigation
2. Supabase configuration
3. Authentication flow (OTP-based)
4. Basic dashboard with stats

### Phase 2: Expense Management

1. Add expense functionality
2. Expense list and filtering
3. Edit/delete expenses
4. Quick expense features

### Phase 3: Categories & Polish

1. Categories management
2. UI polish and animations
3. Error handling and edge cases
4. Performance optimization

## Testing Requirements

- Unit tests for utilities and hooks
- Integration tests for auth flow
- E2E tests for critical user paths
- Test on both iOS and Android
- Test offline functionality

## Performance Considerations

- Implement lazy loading for lists
- Use FlatList for large data sets
- Optimize images and assets
- Minimize bundle size
- Implement proper caching strategies

## Security

- Validate all inputs on client and server
- Use Supabase RLS for data security
- Store sensitive data securely
- Implement proper logout functionality
- Handle session expiration gracefully

## Deployment

- Configure for both iOS and Android
- Set up proper environment variables
- Configure app icons and splash screens
- Set up push notifications (future enhancement)
- Prepare for app store submissions

## Additional Notes

- Maintain consistency with web app functionality
- Ensure offline capabilities where possible
- Follow platform-specific design guidelines (iOS Human Interface Guidelines, Material Design)
- Implement proper deep linking for navigation
- Consider implementing biometric authentication as enhancement

## Success Criteria

The mobile app should:
✅ Have 100% feature parity with the web app
✅ Use the exact same Supabase backend
✅ Follow the specified color scheme
✅ Implement OTP-based authentication
✅ Provide smooth, native mobile experience
✅ Pass all basic functionality tests
✅ Support both iOS and Android platforms
