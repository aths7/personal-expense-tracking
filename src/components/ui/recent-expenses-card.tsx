import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/utils/dates';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: {
    name: string;
  };
}

interface RecentExpensesCardProps {
  expenses: Expense[];
  loading?: boolean;
  limit?: number;
}

export function RecentExpensesCard({ expenses, loading = false, limit = 5 }: RecentExpensesCardProps) {
  const recentExpenses = expenses.slice(0, limit);

  return (
    <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Expenses</CardTitle>
        <CardDescription>
          Your latest transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <LoadingSkeleton type="list-item" count={3} />
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}