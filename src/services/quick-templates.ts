import { createClient } from '@/lib/supabase/client';

export interface QuickExpenseTemplate {
  id: string;
  user_id: string;
  icon: string;
  label: string;
  amount: number;
  category_name: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateQuickExpenseTemplate {
  icon: string;
  label: string;
  amount: number;
  category_name: string;
  color?: string;
  sort_order?: number;
}

export interface UpdateQuickExpenseTemplate {
  icon?: string;
  label?: string;
  amount?: number;
  category_name?: string;
  color?: string;
  sort_order?: number;
}

const supabase = createClient();

export const quickTemplateService = {
  // Get all templates for the current user
  async getUserTemplates(): Promise<{ data: QuickExpenseTemplate[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('quick_expense_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error fetching templates:', error);
      return { data: null, error };
    }
  },

  // Create a new template
  async createTemplate(templateData: CreateQuickExpenseTemplate): Promise<{ data: QuickExpenseTemplate | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      // Get the current max sort_order for this user
      const { data: existingTemplates } = await supabase
        .from('quick_expense_templates')
        .select('sort_order')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextSortOrder = existingTemplates && existingTemplates.length > 0 
        ? existingTemplates[0].sort_order + 1 
        : 0;

      const { data, error } = await supabase
        .from('quick_expense_templates')
        .insert({
          user_id: user.id,
          icon: templateData.icon,
          label: templateData.label,
          amount: templateData.amount,
          category_name: templateData.category_name,
          color: templateData.color || '#5c5c99',
          sort_order: templateData.sort_order ?? nextSortOrder,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating template:', error);
      return { data: null, error };
    }
  },

  // Update an existing template
  async updateTemplate(id: string, updates: UpdateQuickExpenseTemplate): Promise<{ data: QuickExpenseTemplate | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('quick_expense_templates')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own templates
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating template:', error);
      return { data: null, error };
    }
  },

  // Delete a template
  async deleteTemplate(id: string): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('quick_expense_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own templates

      return { error };
    } catch (error) {
      console.error('Error deleting template:', error);
      return { error };
    }
  },

  // Create default templates for a new user
  async createDefaultTemplates(): Promise<{ data: QuickExpenseTemplate[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      // Check if user already has templates
      const { data: existingTemplates } = await this.getUserTemplates();
      if (existingTemplates && existingTemplates.length > 0) {
        return { data: existingTemplates, error: null };
      }

      const defaultTemplates: CreateQuickExpenseTemplate[] = [
        { icon: 'Coffee', label: 'Tea/Coffee', amount: 25, category_name: 'Food & Dining', color: '#5c5c99', sort_order: 0 },
        { icon: 'Utensils', label: 'Meal', amount: 150, category_name: 'Food & Dining', color: '#a3a3cc', sort_order: 1 },
        { icon: 'Car', label: 'Transport', amount: 50, category_name: 'Transportation', color: '#292966', sort_order: 2 },
        { icon: 'ShoppingBag', label: 'Shopping', amount: 500, category_name: 'Shopping', color: '#4a4a88', sort_order: 3 },
      ];

      const { data, error } = await supabase
        .from('quick_expense_templates')
        .insert(
          defaultTemplates.map(template => ({
            user_id: user.id,
            ...template,
          }))
        )
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error creating default templates:', error);
      return { data: null, error };
    }
  },

  // Update sort order of templates
  async updateSortOrder(templates: { id: string; sort_order: number }[]): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      // Update each template's sort order
      const updates = templates.map(({ id, sort_order }) =>
        supabase
          .from('quick_expense_templates')
          .update({ sort_order })
          .eq('id', id)
          .eq('user_id', user.id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error).map(result => result.error);

      return { error: errors.length > 0 ? errors : null };
    } catch (error) {
      console.error('Error updating sort order:', error);
      return { error };
    }
  },
};