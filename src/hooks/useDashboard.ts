'use client';

import { useState, useEffect, useCallback } from 'react';
import { expensesService } from '@/services/expenses';
import { expenseEvents } from '@/lib/expense-events';
import type { DashboardStats } from '@/types';
import { toast } from 'sonner';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    totalThisMonth: 0,
    totalLastMonth: 0,
    categoryBreakdown: [],
    monthlyTrend: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await expensesService.getExpenseStats();
      
      if (error) {
        setError(error.message || 'Failed to fetch dashboard stats');
        toast.error('Failed to fetch dashboard stats');
        return;
      }
      
      if (data) {
        // The data is already pre-calculated from the service
        setStats({
          totalExpenses: data.totalExpenses,
          totalThisMonth: data.totalThisMonth,
          totalLastMonth: data.totalLastMonth,
          categoryBreakdown: data.categoryBreakdown,
          monthlyTrend: data.monthlyTrend,
        });
      }
    } catch {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Listen for expense events to update dashboard in real-time
  useEffect(() => {
    const handleExpenseChange = () => {
      fetchStats();
    };

    // Subscribe to expense events
    const unsubscribeAdd = expenseEvents.on('EXPENSE_ADDED', handleExpenseChange);
    const unsubscribeUpdate = expenseEvents.on('EXPENSE_UPDATED', handleExpenseChange);
    const unsubscribeDelete = expenseEvents.on('EXPENSE_DELETED', handleExpenseChange);

    // Cleanup subscriptions
    return () => {
      unsubscribeAdd();
      unsubscribeUpdate();
      unsubscribeDelete();
    };
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};