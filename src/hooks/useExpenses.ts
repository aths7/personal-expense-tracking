'use client';

import { useState, useEffect, useCallback } from 'react';
import { expensesService } from '@/services/expenses';
import { gamificationService } from '@/services/gamification';
import { expenseEvents } from '@/lib/expense-events';
import type { Expense, ExpenseFormData, FilterOptions } from '@/types';
import { toast } from 'sonner';

export const useExpenses = (initialFilters: FilterOptions = {}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await expensesService.getExpenses(filters);
      
      if (error) {
        setError(error.message || 'Failed to fetch expenses');
        toast.error('Failed to fetch expenses');
        return;
      }
      
      setExpenses(data || []);
    } catch {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createExpense = async (data: ExpenseFormData) => {
    try {
      const { data: newExpense, error } = await expensesService.createExpense(data);
      
      if (error) {
        toast.error(error.message || 'Failed to create expense');
        return { success: false, error };
      }
      
      if (newExpense) {
        setExpenses(prev => [newExpense, ...prev]);
        toast.success('Expense created successfully!');
        
        // Emit event for dashboard and other components to update
        expenseEvents.emit('EXPENSE_ADDED', newExpense);
        
        // Check for achievements
        setTimeout(async () => {
          await gamificationService.checkAchievements();
        }, 1000);
        
        return { success: true, data: newExpense };
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  };

  // Alias for createExpense for backward compatibility
  const addExpense = createExpense;

  const checkAchievements = async () => {
    try {
      await gamificationService.checkAchievements();
    } catch {
      // Silently handle achievement check failures
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseFormData>) => {
    try {
      const { data: updatedExpense, error } = await expensesService.updateExpense(id, data);
      
      if (error) {
        toast.error(error.message || 'Failed to update expense');
        return { success: false, error };
      }
      
      if (updatedExpense) {
        setExpenses(prev => prev.map(expense => 
          expense.id === id ? updatedExpense : expense
        ));
        toast.success('Expense updated successfully!');
        
        // Emit event for dashboard and other components to update
        expenseEvents.emit('EXPENSE_UPDATED', updatedExpense);
        
        return { success: true, data: updatedExpense };
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await expensesService.deleteExpense(id);
      
      if (error) {
        toast.error(error.message || 'Failed to delete expense');
        return { success: false, error };
      }
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.success('Expense deleted successfully!');
      
      // Emit event for dashboard and other components to update
      expenseEvents.emit('EXPENSE_DELETED', { id });
      
      return { success: true };
    } catch (err) {
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    filters,
    createExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    updateFilters,
    clearFilters,
    checkAchievements,
    refetch: fetchExpenses,
  };
};