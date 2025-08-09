import { createClient } from '@/lib/supabase/client';
import type { Category, CategoryFormData } from '@/types';
import type { PostgrestError } from '@supabase/supabase-js';

export interface CategoriesService {
  getCategories: () => Promise<{ data: Category[] | null; error: PostgrestError | string | null }>;
  createCategory: (d: CategoryFormData) => Promise<{ data: Category | null; error: PostgrestError | string | null }>;
  updateCategory: (id: string, d: Partial<CategoryFormData>) => Promise<{ data: Category | null; error: PostgrestError | string | null }>;
  deleteCategory: (id: string) => Promise<{ error: PostgrestError | string | null }>;
}

export const categoriesService: CategoriesService = {
  getCategories: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${user.id},is_default.eq.true`)
      .order('name');

    return { data, error };
  },

  createCategory: async (formData: CategoryFormData) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          ...formData,
          user_id: user.id,
          is_default: false,
        },
      ])
      .select()
      .single();

    return { data, error };
  },

  updateCategory: async (id: string, formData: Partial<CategoryFormData>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    return { data, error };
  },

  deleteCategory: async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    return { error };
  },
};