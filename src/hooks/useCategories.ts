'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoriesService } from '@/services/categories';
import type { Category, CategoryFormData } from '@/types';
import { toast } from 'sonner';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await categoriesService.getCategories();
      
      if (error) {
        setError(error.message || 'Failed to fetch categories');
        toast.error('Failed to fetch categories');
        return;
      }
      
      setCategories(data || []);
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (data: CategoryFormData) => {
    try {
      const { data: newCategory, error } = await categoriesService.createCategory(data);
      
      if (error) {
        toast.error(error.message || 'Failed to create category');
        return { success: false, error };
      }
      
      if (newCategory) {
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Category created successfully!');
        return { success: true, data: newCategory };
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  };

  const updateCategory = async (id: string, data: Partial<CategoryFormData>) => {
    try {
      const { data: updatedCategory, error } = await categoriesService.updateCategory(id, data);
      
      if (error) {
        toast.error(error.message || 'Failed to update category');
        return { success: false, error };
      }
      
      if (updatedCategory) {
        setCategories(prev => prev.map(category => 
          category.id === id ? updatedCategory : category
        ).sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Category updated successfully!');
        return { success: true, data: updatedCategory };
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await categoriesService.deleteCategory(id);
      
      if (error) {
        toast.error(error.message || 'Failed to delete category');
        return { success: false, error };
      }
      
      setCategories(prev => prev.filter(category => category.id !== id));
      toast.success('Category deleted successfully!');
      return { success: true };
    } catch (err) {
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const getUserCategories = () => {
    return categories.filter(category => !category.is_default);
  };

  const getDefaultCategories = () => {
    return categories.filter(category => category.is_default);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getUserCategories,
    getDefaultCategories,
    refetch: fetchCategories,
  };
};