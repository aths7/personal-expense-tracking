import { useState, useEffect } from 'react';
import { 
  quickTemplateService, 
  type QuickExpenseTemplate, 
  type CreateQuickExpenseTemplate, 
  type UpdateQuickExpenseTemplate 
} from '@/services/quick-templates';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useQuickTemplates() {
  const [templates, setTemplates] = useState<QuickExpenseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch templates when user changes
  useEffect(() => {
    if (user) {
      fetchTemplates();
    } else {
      setTemplates([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await quickTemplateService.getUserTemplates();

      if (fetchError) {
        console.error('Error fetching templates:', fetchError);
        setError('Failed to load templates');
        return;
      }

      if (!data || data.length === 0) {
        // Create default templates for new user
        const { data: defaultTemplates, error: createError } = await quickTemplateService.createDefaultTemplates();
        
        if (createError) {
          console.error('Error creating default templates:', createError);
          setError('Failed to create default templates');
          return;
        }

        setTemplates(defaultTemplates || []);
      } else {
        setTemplates(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: CreateQuickExpenseTemplate) => {
    try {
      const { data, error } = await quickTemplateService.createTemplate(templateData);

      if (error) {
        console.error('Error creating template:', error);
        toast.error('Failed to create template');
        return null;
      }

      if (data) {
        setTemplates(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
        toast.success('Template created successfully!');
        return data;
      }
    } catch (err) {
      console.error('Unexpected error creating template:', err);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const updateTemplate = async (id: string, updates: UpdateQuickExpenseTemplate) => {
    try {
      const { data, error } = await quickTemplateService.updateTemplate(id, updates);

      if (error) {
        console.error('Error updating template:', error);
        toast.error('Failed to update template');
        return null;
      }

      if (data) {
        setTemplates(prev =>
          prev.map(template => (template.id === id ? data : template))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        toast.success('Template updated successfully!');
        return data;
      }
    } catch (err) {
      console.error('Unexpected error updating template:', err);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await quickTemplateService.deleteTemplate(id);

      if (error) {
        console.error('Error deleting template:', error);
        toast.error('Failed to delete template');
        return false;
      }

      setTemplates(prev => prev.filter(template => template.id !== id));
      toast.success('Template deleted successfully!');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting template:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const updateSortOrder = async (templateUpdates: { id: string; sort_order: number }[]) => {
    try {
      const { error } = await quickTemplateService.updateSortOrder(templateUpdates);

      if (error) {
        console.error('Error updating sort order:', error);
        toast.error('Failed to update template order');
        return false;
      }

      // Update local state
      setTemplates(prev => {
        const updated = [...prev];
        templateUpdates.forEach(update => {
          const template = updated.find(t => t.id === update.id);
          if (template) {
            template.sort_order = update.sort_order;
          }
        });
        return updated.sort((a, b) => a.sort_order - b.sort_order);
      });

      return true;
    } catch (err) {
      console.error('Unexpected error updating sort order:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    updateSortOrder,
    refetch: fetchTemplates,
  };
}