'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/ui/page-header';
import { CategorySection } from '@/components/ui/category-section';
import { CategoryCard } from '@/components/ui/category-card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { CategoryForm } from '@/components/forms/category-form';
import { useCategories } from '@/hooks/useCategories';
import { usePageActions } from '@/hooks/usePageActions';
import { type CategoryFormData } from '@/types';
import {
  Plus,
  Shield,
  User,
} from 'lucide-react';

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const { 
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    getUserCategories,
    getDefaultCategories,
  } = useCategories();

  const {
    isSubmitting,
    activeDialog,
    openDialog,
    closeDialog,
    handleDelete,
    withLoading,
  } = usePageActions({
    onDelete: deleteCategory,
    deleteItemName: 'category',
    deleteConsequence: 'Expenses with this category will become uncategorized.'
  });

  const userCategories = getUserCategories();
  const defaultCategories = getDefaultCategories();

  const handleCreateCategory = async (data: CategoryFormData) => {
    return await withLoading(() => createCategory(data));
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    return await withLoading(() => updateCategory(editingCategory, data).then(result => {
      if (result?.success) {
        setEditingCategory(null);
      }
      return result;
    }));
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
    return <LoadingSkeleton type="spinner" />;
  }

  return (
      <div className="space-y-6">
        <PageHeader
          title="Categories"
          subtitle="Organize your expenses with custom categories"
          responsive={false}
          actions={
            <Dialog open={activeDialog === 'create'} onOpenChange={(open) => open ? openDialog('create') : closeDialog()}>
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
          }
        />

        <CategorySection
          title="Your Categories"
          description="Custom categories you've created"
          icon={User}
        >
          {userCategories.length === 0 ? (
            <EmptyState
              icon={Plus}
              title="No custom categories yet"
              description="Create your first custom category to better organize your expenses."
              action={{
                label: "Add Category",
                onClick: () => openDialog('create'),
                icon: Plus
              }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  color={category.color}
                  icon={category.icon}
                  isCustom={true}
                  onEdit={setEditingCategory}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CategorySection>

        <Separator />

        <CategorySection
          title="Default Categories"
          description="Pre-built categories available to all users"
          icon={Shield}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {defaultCategories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                color={category.color}
                icon={category.icon}
                isCustom={false}
                showActions={false}
              />
            ))}
          </div>
        </CategorySection>

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
  );
}