export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  user_id: string;
  is_default: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface ExpenseFormData {
  amount: number;
  description: string;
  category_id: string;
  date: string;
}

export interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
}

export interface FilterOptions {
  category_id?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  totalThisMonth: number;
  totalLastMonth: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export type Theme = 'light' | 'dark' | 'system';