'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpenseCharts, CategoryBarChart } from '@/components/charts/expense-charts';
import { SeasonalWidget } from '@/components/seasonal/seasonal-widget';
import { QuickExpenseButton } from '@/components/expenses/quick-expense-button';
import { ExpenseModal } from '@/components/expenses/expense-modal';
import { useDashboard } from '@/hooks/useDashboard';
import { useExpenses } from '@/hooks/useExpenses';
import { useGamification } from '@/hooks/useGamification';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/utils/dates';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Plus,
  ReceiptIndianRupee,
  Calendar,
  Trophy,
  Flame,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          {getTrendIcon()}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const { stats, loading: statsLoading } = useDashboard();
  const { expenses, loading: expensesLoading } = useExpenses({});
  const { gameStats, loading: gameLoading } = useGamification();

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

  if (statsLoading || expensesLoading || gameLoading) {
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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-moonlight">Current Status</h1>
              <div className="px-3 py-1 glass-morphism dark:glass-morphism-dark rounded-full border border-primary/20 w-fit">
                <p className="text-sm font-medium text-primary">
                  <span className="hidden sm:inline">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="sm:hidden">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Overview of your financial activity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <QuickExpenseButton />
            <Button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            description="All time total"
            icon={IndianRupee}
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
            icon={ReceiptIndianRupee}
          />
        </div>

        {/* Charts */}
        <ExpenseCharts stats={stats} />

        {/* Category Bar Chart */}
        <CategoryBarChart categoryBreakdown={stats.categoryBreakdown} />

        {/* Bottom Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Expenses */}
          <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Expenses</CardTitle>
              <CardDescription>
                Your latest transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{expense.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{expense.category?.name}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary">
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
                <Button asChild variant="outline" className="w-full mt-4 border-primary/30 hover:border-primary/50 hover:bg-primary/5">
                  <Link href="/expenses">View All Expenses</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Gamification Card */}
          {gameStats && (
            <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <span>Your Progress</span>
                </CardTitle>
                <CardDescription>
                  Level up your expense tracking game!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{gameStats.levelInfo.name}</p>
                    <p className="text-sm text-muted-foreground">Level {gameStats.levelInfo.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">{gameStats.profile.total_points}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 glass-morphism dark:glass-morphism-dark rounded-lg border border-border/20">
                    <Flame className="h-5 w-5 text-accent mx-auto mb-1" />
                    <p className="font-bold text-foreground">{gameStats.profile.current_streak}</p>
                    <p className="text-xs text-muted-foreground">day streak</p>
                  </div>
                  <div className="text-center p-3 glass-morphism dark:glass-morphism-dark rounded-lg border border-border/20">
                    <Star className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="font-bold text-foreground">{gameStats.achievements.length}</p>
                    <p className="text-xs text-muted-foreground">achievements</p>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full border-primary/30 hover:border-primary/50 hover:bg-primary/5">
                  <Link href="/gamification">View All Progress</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Seasonal Events Widget */}
          <SeasonalWidget />
        </div>
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        redirectAfterSubmit={true}
      />
    </DashboardLayout>
  );
}