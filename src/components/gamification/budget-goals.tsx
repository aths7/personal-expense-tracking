import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { GameStats, BudgetGoalFormData } from '@/types/gamification';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/currency';
import { PERIOD_LABELS } from '@/constants/gamification';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Loader2
} from 'lucide-react';

interface BudgetGoalsProps {
  gameStats: GameStats;
  onCreateGoal: (data: BudgetGoalFormData) => Promise<{ success: boolean }>;
  onUpdateGoal: (id: string, data: Partial<BudgetGoalFormData>) => Promise<{ success: boolean }>;
  onDeleteGoal: (id: string) => Promise<{ success: boolean }>;
}

const budgetGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  target_amount: z.number().min(0.01, 'Amount must be greater than 0'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  category_id: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
});

export function BudgetGoals({ gameStats, onCreateGoal, onUpdateGoal, onDeleteGoal }: BudgetGoalsProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BudgetGoalFormData>({
    resolver: zodResolver(budgetGoalSchema),
    defaultValues: {
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      period: 'monthly',
    },
  });

  const handleCreateGoal = async (data: BudgetGoalFormData) => {
    setIsSubmitting(true);
    try {
      const result = await onCreateGoal(data);
      if (result.success) {
        setShowNewDialog(false);
        reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGoal = async (data: BudgetGoalFormData) => {
    if (!editingGoal) return;
    
    setIsSubmitting(true);
    try {
      const result = await onUpdateGoal(editingGoal, data);
      if (result.success) {
        setEditingGoal(null);
        reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget goal?')) {
      await onDeleteGoal(id);
    }
  };

  const getEditingGoalData = () => {
    if (!editingGoal) return undefined;
    const goal = gameStats.budgetGoals.find(g => g.id === editingGoal);
    return goal;
  };

  // Calculate progress for each goal (simplified - would need actual expense data)
  const calculateProgress = (goal: typeof gameStats.budgetGoals[0]) => {
    // This is a simplified calculation - in a real app, you'd fetch actual spending data
    // for the goal's period and category
    return Math.random() * 100; // Placeholder
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage <= 75) return 'bg-green-500';
    if (percentage <= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Budget Goals</h3>
        </div>
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Budget Goal</DialogTitle>
              <DialogDescription>
                Set a spending target to help manage your finances.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreateGoal)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Monthly Groceries"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_amount">Target Amount</Label>
                <Input
                  id="target_amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...register('target_amount', { valueAsNumber: true })}
                  className={errors.target_amount ? 'border-red-500' : ''}
                />
                {errors.target_amount && (
                  <p className="text-sm text-red-500">{errors.target_amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => setValue('period', value)}
                  defaultValue="monthly"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Category (Optional)</Label>
                <Select
                  onValueChange={(value) => setValue('category_id', value === 'all' ? undefined : value)}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register('start_date')}
                    className={errors.start_date ? 'border-red-500' : ''}
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red-500">{errors.start_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    {...register('end_date')}
                    className={errors.end_date ? 'border-red-500' : ''}
                  />
                  {errors.end_date && (
                    <p className="text-sm text-red-500">{errors.end_date.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {gameStats.budgetGoals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Budget Goals Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Set your first budget goal to start tracking your spending targets.
            </p>
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {gameStats.budgetGoals.map((goal) => {
            const progress = calculateProgress(goal);
            const percentage = (progress / goal.target_amount) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <Card key={goal.id} className={isOverBudget ? 'border-red-200 dark:border-red-800' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{PERIOD_LABELS[goal.period]}</Badge>
                        {goal.category && (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: goal.category.color }}
                            />
                            <span>{goal.category.name}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingGoal(goal.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <div className="flex items-center space-x-2">
                      {isOverBudget ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                      <span className={`font-medium ${isOverBudget ? 'text-red-600' : ''}`}>
                        {formatCurrency(progress)} / {formatCurrency(goal.target_amount)}
                      </span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${getProgressColor(progress, goal.target_amount)}`}
                  />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.end_date).toLocaleDateString()}
                    </span>
                    <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}