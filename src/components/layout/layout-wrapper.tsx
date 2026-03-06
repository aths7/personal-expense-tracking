'use client';

import { usePathname } from 'next/navigation';
import { DashboardLayout } from './dashboard-layout';
import { AuthGuard } from '@/components/auth/auth-guard';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const dashboardRoutes = [
  '/dashboard',
  '/expenses',
  '/categories', 
  '/quick-expenses',
  '/loans'
];

const authRequiredRoutes = [
  ...dashboardRoutes
];

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));
  const isAuthRequired = authRequiredRoutes.some(route => pathname.startsWith(route));
  
  if (isDashboardRoute) {
    return (
      <AuthGuard>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </AuthGuard>
    );
  }
  
  if (isAuthRequired) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    );
  }
  
  return <>{children}</>;
}