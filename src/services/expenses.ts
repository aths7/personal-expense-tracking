import { createClient } from '@/lib/supabase/client';
import type { Expense, ExpenseFormData, FilterOptions, Category, DashboardStats } from '@/types';

interface ExpenseWithCategory extends Expense {
  category?: Category;
}

export interface ExpensesService {
  getExpenses: (filters?: FilterOptions) => Promise<{ data: ExpenseWithCategory[] | null; error: Error | null }>;
  getExpenseById: (id: string) => Promise<{ data: ExpenseWithCategory | null; error: Error | null }>;
  createExpense: (data: ExpenseFormData) => Promise<{ data: ExpenseWithCategory | null; error: Error | null }>;
  updateExpense: (id: string, data: Partial<ExpenseFormData>) => Promise<{ data: ExpenseWithCategory | null; error: Error | null }>;
  deleteExpense: (id: string) => Promise<{ error: Error | null }>;
  getExpenseStats: () => Promise<{ data: DashboardStats | null; error: Error | null }>;
}

export const expensesService: ExpensesService = {
  getExpenses: async (filters: FilterOptions = {}) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    let query = supabase
      .from('expenses')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('user_id', user.id);

    // Apply filters
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.date_from) {
      query = query.gte('date', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('date', filters.date_to);
    }

    if (filters.min_amount !== undefined) {
      query = query.gte('amount', filters.min_amount);
    }

    if (filters.max_amount !== undefined) {
      query = query.lte('amount', filters.max_amount);
    }

    if (filters.search) {
      query = query.ilike('description', `%${filters.search}%`);
    }

    // Add ordering first, then limit
    query = query.order('date', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ExpenseWithCategory[], error: null };
  },

  getExpenseById: async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ExpenseWithCategory, error: null };
  },

  createExpense: async (formData: ExpenseFormData) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        user_id: user.id,
        category_id: formData.category_id,
        amount: formData.amount,
        description: formData.description,
        date: formData.date,
      }])
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ExpenseWithCategory, error: null };
  },

  updateExpense: async (id: string, formData: Partial<ExpenseFormData>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('expenses')
      .update({
        category_id: formData.category_id,
        amount: formData.amount,
        description: formData.description,
        date: formData.date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ExpenseWithCategory, error: null };
  },

  deleteExpense: async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  },

  getExpenseStats: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Get current month and last month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

    // Use Promise.all to fetch data in parallel for better performance
    const [
      totalResult,
      currentMonthResult,
      lastMonthResult,
      categoryResult,
      monthlyTrendResult
    ] = await Promise.all([
      // Total expenses (just count and sum)
      supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id),
      
      // Current month expenses
      supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', currentMonthStart)
        .lte('date', currentMonthEnd),
      
      // Last month expenses
      supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', lastMonthStart)
        .lte('date', lastMonthEnd),
      
      // Category breakdown (only recent data for performance)
      supabase
        .from('expenses')
        .select(`
          amount,
          category:categories(name, color)
        `)
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // Last 90 days only
        .order('date', { ascending: false }),
      
      // Monthly trend (last 6 months only)
      supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // Last 180 days
        .order('date', { ascending: false })
    ]);

    // Check for errors
    if (totalResult.error || currentMonthResult.error || lastMonthResult.error || 
        categoryResult.error || monthlyTrendResult.error) {
      const firstError = totalResult.error || currentMonthResult.error || 
                        lastMonthResult.error || categoryResult.error || monthlyTrendResult.error;
      return { data: null, error: new Error(firstError?.message || 'Failed to fetch stats') };
    }

    // Process results
    const totalExpenses = totalResult.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const totalThisMonth = currentMonthResult.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const totalLastMonth = lastMonthResult.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    // Process category breakdown
    const categoryMap = new Map<string, { category: string; amount: number; color: string }>();
    categoryResult.data?.forEach((expense: any) => {
      const categoryName = expense.category?.name || 'Uncategorized';
      const categoryColor = expense.category?.color || '#D5DBDB';
      
      if (categoryMap.has(categoryName)) {
        const existing = categoryMap.get(categoryName)!;
        categoryMap.set(categoryName, {
          category: existing.category,
          color: existing.color,
          amount: existing.amount + expense.amount,
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

    // Process monthly trend
    const monthlyMap = new Map();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyMap.set(monthKey, { month: monthName, amount: 0 });
    }
    
    monthlyTrendResult.data?.forEach((expense: any) => {
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

    return {
      data: {
        totalExpenses,
        totalThisMonth,
        totalLastMonth,
        categoryBreakdown,
        monthlyTrend,
      },
      error: null
    };
  },
};