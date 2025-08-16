'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Coffee,
  Utensils,
  Car,
  ShoppingBag,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  IndianRupee,
  Settings,
  Loader2
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useQuickTemplates } from '@/hooks/useQuickTemplates';
import { type CreateQuickExpenseTemplate } from '@/services/quick-templates';
import { formatCurrency } from '@/lib/currency';


const iconOptions = [
  { value: 'Coffee', label: 'Coffee', component: Coffee },
  { value: 'Utensils', label: 'Food', component: Utensils },
  { value: 'Car', label: 'Transport', component: Car },
  { value: 'ShoppingBag', label: 'Shopping', component: ShoppingBag },
];

export default function QuickExpensesPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    icon: 'Coffee',
    label: '',
    amount: 0,
    category_name: '',
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { categories } = useCategories();
  const {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useQuickTemplates();

  const handleEdit = (template: typeof templates[0]) => {
    setEditingId(template.id);
  };

  const handleSave = async (id: string, updatedData: any) => {
    await updateTemplate(id, {
      icon: updatedData.icon,
      label: updatedData.label,
      amount: updatedData.amount,
      category_name: updatedData.category_name,
      color: updatedData.color,
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
  };

  const handleAddNew = async () => {
    if (!newTemplate.label || !newTemplate.category_name || newTemplate.amount <= 0) {
      toast.error('Please fill all fields');
      return;
    }

    const category = categories?.find(c => c.name === newTemplate.category_name);

    const templateData: CreateQuickExpenseTemplate = {
      icon: newTemplate.icon,
      label: newTemplate.label,
      amount: newTemplate.amount,
      category_name: newTemplate.category_name,
      color: category?.color || '#5c5c99',
    };

    const result = await createTemplate(templateData);

    if (result) {
      setNewTemplate({
        icon: 'Coffee',
        label: '',
        amount: 0,
        category_name: '',
      });
      setIsAddingNew(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption?.component || Coffee;
  };

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading templates...</span>
          </div>
        </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-2">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-moonlight">
                Quick Expenses
              </h1>
            </div>
            <p className="text-muted-foreground">
              Customize your quick expense templates for faster entry
            </p>
          </div>
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>

        {/* Add New Template Form */}
        {isAddingNew && (
          <Card className="glass-morphism dark:glass-morphism-dark border border-primary/30 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                New Quick Expense Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Icon</Label>
                  <Select value={newTemplate.icon} onValueChange={(value) => setNewTemplate({ ...newTemplate, icon: value })}>
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50">
                      {iconOptions.map((option) => {
                        const IconComponent = option.component;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Label</Label>
                  <Input
                    value={newTemplate.label}
                    onChange={(e) => setNewTemplate({ ...newTemplate, label: e.target.value })}
                    placeholder="e.g. Morning Coffee"
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Amount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={newTemplate.amount || ''}
                      onChange={(e) => setNewTemplate({ ...newTemplate, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Category</Label>
                  <Select value={newTemplate.category_name} onValueChange={(value) => setNewTemplate({ ...newTemplate, category_name: value })}>
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50">
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddNew}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const IconComponent = getIconComponent(template.icon);
            const isEditing = editingId === template.id;

            return (
              <Card key={template.id} className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant hover:shadow-elegant-hover transition-all duration-300">
                <CardContent className="p-6">
                  {isEditing ? (
                    <EditTemplateForm
                      template={template}
                      categories={categories || []}
                      onSave={(updatedData) => handleSave(template.id, updatedData)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg glass-morphism dark:glass-morphism-dark border border-border/20">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{template.label}</h3>
                            <p className="text-sm text-muted-foreground">{template.category_name}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(template)}
                            className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-full"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(template.id)}
                            className="border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5 text-destructive rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-center pt-4 border-t border-border/20">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(template.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">Quick add amount</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {templates.length === 0 && (
          <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
            <CardContent className="p-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Quick Expenses Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first quick expense template to speed up your expense tracking
              </p>
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

// Edit Template Form Component
interface EditTemplateFormProps {
  template: {
    id: string;
    icon: string;
    label: string;
    amount: number;
    category_name: string;
    color: string;
  };
  categories: Array<{ id: string; name: string; color: string }>;
  onSave: (updatedData: any) => void;
  onCancel: () => void;
}

function EditTemplateForm({ template, categories, onSave, onCancel }: EditTemplateFormProps) {
  const [formData, setFormData] = useState({
    icon: template.icon,
    label: template.label,
    amount: template.amount,
    category_name: template.category_name,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.category_name || formData.amount <= 0) {
      toast.error('Please fill all fields');
      return;
    }

    const category = categories.find(c => c.name === formData.category_name);
    onSave({
      ...formData,
      color: category?.color || template.color,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50">
              {iconOptions.map((option) => {
                const IconComponent = option.component;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Label</Label>
          <Input
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Amount</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Category</Label>
          <Select value={formData.category_name} onValueChange={(value) => setFormData({ ...formData, category_name: value })}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          size="sm"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-full"
        >
          <X className="w-4 w-4" />
        </Button>
      </div>
    </form>
  );
}