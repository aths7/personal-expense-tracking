'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CategoryForm } from '@/components/forms/category-form';
import { useCategories } from '@/hooks/useCategories';
import { type CategoryFormData } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
} from 'lucide-react';

export default function CategoriesPage() {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    getUserCategories,
    getDefaultCategories,
  } = useCategories();

  const userCategories = getUserCategories();
  const defaultCategories = getDefaultCategories();

  const handleCreateCategory = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createCategory(data);
      if (result?.success) {
        setShowNewDialog(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateCategory(editingCategory, data);
      if (result?.success) {
        setEditingCategory(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Expenses with this category will become uncategorized.')) {
      await deleteCategory(id);
    }
  };

  const getEditingCategoryData = () => {
    if (!editingCategory) return undefined;
    const category = categories.find(c => c.id === editingCategory);
    if (!category) return undefined;
    
    return {
      name: category.name,
      color: category.color || '#D5DBDB',
      icon: category.icon || 'MoreHorizontal',
    };
  };

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Organize your expenses with custom categories
            </p>
          </div>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a custom category to organize your expenses.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm
                onSubmit={handleCreateCategory}
                isSubmitting={isSubmitting}
                submitText="Create Category"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Your Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Your Categories</CardTitle>
            </div>
            <CardDescription>
              Custom categories you&apos;ve created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userCategories.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400">
                  <Plus className="h-12 w-12 mx-auto mb-4" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">No custom categories yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first custom category to better organize your expenses.
                  </p>
                  <Button onClick={() => setShowNewDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userCategories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: category.color || '#D5DBDB' }}
                        >
                          {category.icon?.slice(0, 2).toUpperCase() || 'UN'}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary">
                        <User className="h-3 w-3 mr-1" />
                        Custom
                      </Badge>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCategory(category.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Default Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Default Categories</CardTitle>
            </div>
            <CardDescription>
              Pre-built categories available to all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {defaultCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: category.color || '#D5DBDB' }}
                      >
                        {category.icon?.slice(0, 2).toUpperCase() || 'UN'}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the details of your category below.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              defaultValues={getEditingCategoryData()}
              onSubmit={handleUpdateCategory}
              isSubmitting={isSubmitting}
              submitText="Update Category"
            />
          </DialogContent>
        </Dialog>
      </div>
      </DashboardLayout>
    </AuthGuard>
  );
}