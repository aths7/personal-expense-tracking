'use client';

import { useState, useEffect, useCallback } from 'react';
import { expensesService } from '@/services/expenses';
import type { DashboardStats, Expense, Category } from '@/types';
import { getCurrentMonth, getLastMonth } from '@/utils/dates';
import { toast } from 'sonner';

interface ExpenseWithCategory extends Expense {
  category?: Category;
}

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
        const currentMonth = getCurrentMonth();
        const lastMonth = getLastMonth();
        
        // Calculate totals
        const totalExpenses = data.reduce((sum: number, expense: ExpenseWithCategory) => sum + expense.amount, 0);
        
        const totalThisMonth = data
          .filter((expense: ExpenseWithCategory) => 
            expense.date >= currentMonth.start && expense.date <= currentMonth.end
          )
          .reduce((sum: number, expense: ExpenseWithCategory) => sum + expense.amount, 0);
        
        const totalLastMonth = data
          .filter((expense: ExpenseWithCategory) => 
            expense.date >= lastMonth.start && expense.date <= lastMonth.end
          )
          .reduce((sum: number, expense: ExpenseWithCategory) => sum + expense.amount, 0);

        // Calculate category breakdown
        const categoryMap = new Map<string, { category: string; amount: number; color: string }>();
        data.forEach((expense: ExpenseWithCategory) => {
          const categoryName = expense.category?.name || 'Uncategorized';
          const categoryColor = expense.category?.color || '#D5DBDB';
          
          if (categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, {
              ...categoryMap.get(categoryName),
              amount: categoryMap.get(categoryName).amount + expense.amount,
            });
          } else {
            categoryMap.set(categoryName, {
              category: categoryName,
              amount: expense.amount,
              color: categoryColor,
            });
          }
        });
        
        const categoryBreakdown = Array.from(categoryMap.values())
          .sort((a, b) => b.amount - a.amount);

        // Calculate monthly trend (last 6 months)
        const monthlyMap = new Map();
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
          const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          monthlyMap.set(monthKey, { month: monthName, amount: 0 });
        }
        
        data.forEach((expense: ExpenseWithCategory) => {
          const monthKey = expense.date.slice(0, 7);
          if (monthlyMap.has(monthKey)) {
            const existing = monthlyMap.get(monthKey);
            monthlyMap.set(monthKey, {
              ...existing,
              amount: existing.amount + expense.amount,
            });
          }
        });
        
        const monthlyTrend = Array.from(monthlyMap.values());

        setStats({
          totalExpenses,
          totalThisMonth,
          totalLastMonth,
          categoryBreakdown,
          monthlyTrend,
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

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};