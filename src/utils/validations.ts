import { z } from 'zod';
import { EXPENSE_LIMITS } from '@/constants';

export const expenseSchema = z.object({
  amount: z
    .number()
    .min(EXPENSE_LIMITS.MIN_AMOUNT, 'Amount must be greater than 0')
    .max(EXPENSE_LIMITS.MAX_AMOUNT, 'Amount is too large'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(EXPENSE_LIMITS.MAX_DESCRIPTION_LENGTH, 'Description is too long'),
  category_id: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name is too long'),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Please select a valid color'),
  icon: z.string().min(1, 'Please select an icon'),
});

export const filterSchema = z.object({
  category_id: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  min_amount: z.number().min(0).optional(),
  max_amount: z.number().min(0).optional(),
  search: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type FilterFormData = z.infer<typeof filterSchema>;