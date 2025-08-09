import { createClient } from '@/lib/supabase/client';
import type { Expense, ExpenseFormData, FilterOptions, Category } from '@/types';

interface ExpenseWithCategory extends Expense {
  category?: Category;
}

export interface ExpensesService {
  getExpenses: (filters?: FilterOptions) => Promise<{ data: ExpenseWithCategory[] | null; error: Error | null }>;
  getExpenseById: (id: string) => Promise<{ data: ExpenseWithCategory | null; error: Error | null }>;
  createExpense: (data: ExpenseFormData) => Promise<{ data: ExpenseWithCategory | null; error: Error | null }>;
  updateExpense: (id: string, data: Partial<ExpenseFormData>) => Promise<{ data: ExpenseWithCategory | null; error: Error | null }>;
  deleteExpense: (id: string) => Promise<{ error: Error | null }>;
  getExpenseStats: () => Promise<{ data: ExpenseWithCategory[] | null; error: Error | null }>;
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

    const { data, error } = await query.order('date', { ascending: false });

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

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        amount,
        date,
        category:categories(name, color)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ExpenseWithCategory[], error: null };
  },
};