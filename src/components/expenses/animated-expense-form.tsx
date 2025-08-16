'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import type { ExpenseFormData } from '@/types';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  date: z.string(),
});

interface AnimatedExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isSubmitting: boolean;
  submitText?: string;
  defaultValues?: Partial<ExpenseFormData>;
}

export function AnimatedExpenseForm({
  onSubmit,
  isSubmitting,
  submitText = 'Add Expense',
  defaultValues,
}: AnimatedExpenseFormProps) {
  const { categories } = useCategories();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: ExpenseFormData) => {
    try {
      await onSubmit(data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        reset();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit expense:', error);
    }
  };

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-2xl mb-4">✓</div>
        <p className="text-lg font-medium">Expense Added Successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter expense description"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => setValue('category_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adding...' : submitText}
      </Button>
    </form>
  );
}