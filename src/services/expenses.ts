import { createClient } from '@/lib/supabase/client';
import type { Expense, ExpenseFormData, FilterOptions } from '@/types';

export interface ExpensesService {
  getExpenses: (filters?: FilterOptions) => Promise<{ data: Expense[] | null; error: any }>;
  getExpenseById: (id: string) => Promise<{ data: Expense | null; error: any }>;
  createExpense: (data: ExpenseFormData) => Promise<{ data: Expense | null; error: any }>;
  updateExpense: (id: string, data: Partial<ExpenseFormData>) => Promise<{ data: Expense | null; error: any }>;
  deleteExpense: (id: string) => Promise<{ error: any }>;
  getExpenseStats: () => Promise<{ data: any; error: any }>;
}

export const expensesService: ExpensesService = {
  getExpenses: async (filters: FilterOptions = {}) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
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

    const { data, error } = await query.order('date', { ascending: false });

    return { data, error };
  },

  getExpenseById: async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
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

    return { data, error };
  },

  createExpense: async (formData: ExpenseFormData) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          ...formData,
          user_id: user.id,
        },
      ])
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    return { data, error };
  },

  updateExpense: async (id: string, formData: Partial<ExpenseFormData>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    return { data, error };
  },

  deleteExpense: async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    return { error };
  },

  getExpenseStats: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Get total expenses, current month, and category breakdown
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        amount,
        date,
        category:categories(name, color)
      `)
      .eq('user_id', user.id);

    return { data, error };
  },
};