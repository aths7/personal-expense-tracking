'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpenseCharts, CategoryBarChart } from '@/components/charts/expense-charts';
import { useDashboard } from '@/hooks/useDashboard';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/dates';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Receipt,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend 
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          {getTrendIcon()}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboard();
  const { expenses, loading: expensesLoading } = useExpenses({});

  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  const monthlyChange = useMemo(() => {
    if (stats.totalLastMonth === 0) return 0;
    return ((stats.totalThisMonth - stats.totalLastMonth) / stats.totalLastMonth) * 100;
  }, [stats.totalThisMonth, stats.totalLastMonth]);

  const getTrend = (change: number) => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  if (statsLoading || expensesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your financial activity
            </p>
          </div>
          <Button asChild>
            <Link href="/expenses?new=true">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            description="All time total"
            icon={DollarSign}
          />
          <StatCard
            title="This Month"
            value={formatCurrency(stats.totalThisMonth)}
            description={`${monthlyChange >= 0 ? '+' : ''}${monthlyChange.toFixed(1)}% from last month`}
            icon={Calendar}
            trend={getTrend(monthlyChange)}
          />
          <StatCard
            title="Last Month"
            value={formatCurrency(stats.totalLastMonth)}
            description="Previous month total"
            icon={TrendingUp}
          />
          <StatCard
            title="Total Transactions"
            value={expenses.length.toString()}
            description="All recorded expenses"
            icon={Receipt}
          />
        </div>

        {/* Charts */}
        <ExpenseCharts stats={stats} />

        {/* Category Bar Chart */}
        <CategoryBarChart categoryBreakdown={stats.categoryBreakdown} />

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>
              Your latest transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{expense.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{expense.category?.name}</span>
                    <span>•</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
            {recentExpenses.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No expenses recorded yet
              </p>
            )}
            {recentExpenses.length > 0 && (
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/expenses">View All Expenses</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}