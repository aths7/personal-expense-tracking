'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExpenseForm } from '@/components/forms/expense-form';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/utils/dates';
import { type FilterOptions, type ExpenseFormData } from '@/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
} from 'lucide-react';

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [search, setSearch] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    expenses, 
    loading, 
    createExpense, 
    updateExpense, 
    deleteExpense,
    updateFilters,
  } = useExpenses(filters);

  // Open new expense dialog if 'new' query param is present
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowNewDialog(true);
      // Remove the query param
      router.replace('/expenses');
    }
  }, [searchParams, router]);

  const handleCreateExpense = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createExpense(data);
      if (result?.success) {
        setShowNewDialog(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateExpense(editingExpense, data);
      if (result?.success) {
        setEditingExpense(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters };
    if (value === 'all' || !value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const newFilters = { ...filters };
    if (value.trim()) {
      newFilters.search = value.trim();
    } else {
      delete newFilters.search;
    }
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearch('');
    updateFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const getEditingExpenseData = () => {
    if (!editingExpense) return undefined;
    const expense = expenses.find(e => e.id === editingExpense);
    if (!expense) return undefined;
    
    return {
      amount: expense.amount,
      description: expense.description || '',
      category_id: expense.category_id || '',
      date: expense.date,
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Manage and track your expenses
            </p>
          </div>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your expense below.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm
                onSubmit={handleCreateExpense}
                isSubmitting={isSubmitting}
                submitText="Create Expense"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category_id || 'all'}
                  onValueChange={(value) => handleFilterChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || '#D5DBDB' }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={filters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={filters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    let displayValue = value.toString();
                    
                    if (key === 'category_id') {
                      const category = categories.find(c => c.id === value);
                      displayValue = category?.name || value.toString();
                    }
                    
                    return (
                      <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                        <span>{displayValue}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleFilterChange(key as keyof FilterOptions, '')}
                        />
                      </Badge>
                    );
                  })}
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : expenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No expenses found</h3>
                  <p className="text-muted-foreground">
                    {hasActiveFilters 
                      ? 'Try adjusting your filters or add a new expense.'
                      : 'Get started by adding your first expense.'
                    }
                  </p>
                </div>
                <Button onClick={() => setShowNewDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: expense.category?.color || '#D5DBDB' }}
                        />
                        <h3 className="font-medium">{expense.description}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{expense.category?.name || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {formatCurrency(expense.amount)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingExpense(expense.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Update the details of your expense below.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm
              defaultValues={getEditingExpenseData()}
              onSubmit={handleUpdateExpense}
              isSubmitting={isSubmitting}
              submitText="Update Expense"
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}