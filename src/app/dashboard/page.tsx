'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { RecentExpensesCard } from '@/components/ui/recent-expenses-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ExpenseCharts, CategoryBarChart } from '@/components/charts/expense-charts';
import { QuickExpenseButton } from '@/components/expenses/quick-expense-button';
import { ExpenseModal } from '@/components/expenses/expense-modal';
import { useDashboard } from '@/hooks/useDashboard';
import { useExpenses } from '@/hooks/useExpenses';
import { useResponsiveDate } from '@/hooks/useResponsiveDate';
import { formatCurrency } from '@/lib/currency';
import {
  IndianRupee,
  Plus,
  ReceiptIndianRupee,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';


export default function DashboardPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const { stats, loading: statsLoading } = useDashboard();
  const { expenses, loading: expensesLoading } = useExpenses({ limit: 5 });
  const { full: fullDate, short: shortDate } = useResponsiveDate();

  const monthlyChange = useMemo(() => {
    if (stats.totalLastMonth === 0) return 0;
    return ((stats.totalThisMonth - stats.totalLastMonth) / stats.totalLastMonth) * 100;
  }, [stats.totalThisMonth, stats.totalLastMonth]);

  const getTrend = (change: number) => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  const showStats = !statsLoading;
  const showRecentExpenses = !expensesLoading;

  if (statsLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            <PageHeader
              title="Current Status"
              subtitle="Overview of your financial activity"
              dateInfo={`${fullDate}|${shortDate}`}
              gradient
              actions={
                <>
                  <QuickExpenseButton />
                  <Button
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add Expense</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </>
              }
            />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <LoadingSkeleton type="stat-card" count={4} />
            </div>
            
            <LoadingSkeleton type="spinner" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Current Status"
          subtitle="Overview of your financial activity"
          dateInfo={`${fullDate}|${shortDate}`}
          gradient
          actions={
            <>
              <QuickExpenseButton />
              <Button
                onClick={() => setIsExpenseModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </>
          }
        />

        {showStats && (
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
              value={showRecentExpenses ? expenses.length.toString() : '...'}
              description="All recorded expenses"
              icon={ReceiptIndianRupee}
            />
          </div>
        )}

        {/* Charts */}
        {showStats && <ExpenseCharts stats={stats} />}

        {/* Category Bar Chart */}
        {showStats && <CategoryBarChart categoryBreakdown={stats.categoryBreakdown} />}

        <div className="grid gap-6">
          <RecentExpensesCard 
            expenses={expenses} 
            loading={expensesLoading} 
            limit={5} 
          />
        </div>
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        redirectAfterSubmit={true}
      />
      </DashboardLayout>
    </AuthGuard>
  );
}