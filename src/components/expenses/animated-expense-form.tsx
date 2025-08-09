'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DollarSign, 
  Calendar, 
  Tag, 
  Sparkles, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

import { AnimatedCard } from '@/components/ui/animated-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { AnimatedCategorySelector } from '@/components/animations/interactive-categories';
import { MoneyRain } from '@/components/animations/money-rain';
import { 
  ExpenseSuccessAnimation, 
  RippleEffect, 
  FloatingNumber, 
  ConfettiBurst 
} from '@/components/animations/expense-success-animations';
import { useQuickNotifications } from '@/components/ui/notification-system';
import { useMoodTheme } from '@/components/mood/mood-theme-provider';
import { useExpenseAnimations } from '@/hooks/useExpenseAnimations';
import { formatCurrency, getExpenseContext } from '@/lib/currency';

import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AnimatedExpenseFormProps {
  onExpenseAdded?: (expense: Record<string, unknown>) => void;
  onClose?: () => void;
}

export function AnimatedExpenseForm({ onExpenseAdded, onClose }: AnimatedExpenseFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategoryPreview, setSelectedCategoryPreview] = useState<Category | null>(null);

  const { addExpense, expenses } = useExpenses();
  const { categories } = useCategories();
  const notifications = useQuickNotifications();
  const { updateMood } = useMoodTheme();
  const {
    activeAnimations,
    animationData,
    triggerExpenseAnimation,
    clearAllAnimations
  } = useExpenseAnimations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    mode: 'onChange',
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    }
  });

  const watchedAmount = watch('amount');
  const watchedCategoryId = watch('categoryId');

  useEffect(() => {
    if (watchedCategoryId && categories) {
      const category = categories.find(c => c.id === watchedCategoryId);
      setSelectedCategoryPreview(category || null);
    }
  }, [watchedCategoryId, categories]);

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    
    try {
      const expense = await addExpense({
        ...data,
        category_id: data.categoryId,
      });

      if (expense) {
        // Determine animation context
        const isFirstExpense = expenses.length === 0;
        const currentStreak = Math.floor(Math.random() * 7) + 1; // Mock streak data
        const totalExpenses = expenses.length + 1;
        const expenseContext = getExpenseContext(data.amount);
        const isLargeExpense = expenseContext.level === 'large' || expenseContext.level === 'very_large' || expenseContext.level === 'extreme';
        const isBudgetBreached = data.amount > 5000; // Mock budget check
        
        // Achievement mock - you'd replace this with real achievement checking
        let achievementUnlocked: string | undefined;
        if (isFirstExpense) achievementUnlocked = 'First Expense Tracker';
        else if (totalExpenses === 10) achievementUnlocked = 'Tracking Enthusiast';
        else if (totalExpenses === 50) achievementUnlocked = 'Expense Master';

        // Trigger comprehensive animation sequence
        triggerExpenseAnimation({
          amount: data.amount,
          category: selectedCategoryPreview?.name,
          isFirstExpense,
          currentStreak,
          totalExpenses,
          isLargeExpense,
          isBudgetBreached,
          achievementUnlocked
        });

        // Update mood based on spending
        setTimeout(() => {
          updateMood({
            monthlyBudget: 50000, // This would come from user's actual budget (₹50,000)
            currentSpending: data.amount,
            recentExpense: data.amount
          });
        }, 1000);

        // Show success notification after animations start
        setTimeout(() => {
          notifications.success(
            achievementUnlocked ? 'Achievement Unlocked!' : 'Expense Added!',
            achievementUnlocked ? `${achievementUnlocked} - ${formatCurrency(data.amount)} tracked` : 
            `Successfully tracked ${formatCurrency(data.amount)} for ${data.description}`
          );
          
          onExpenseAdded?.(expense);
          reset();
          setStep(1);
        }, 2000);

        // Clear animations and close form after sequence completes
        setTimeout(() => {
          clearAllAnimations();
          if (onClose) onClose();
        }, 6000);
      }
    } catch (error) {
      notifications.error('Failed to add expense', 'Please try again');
      clearAllAnimations();
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getAmountInputColor = () => {
    if (!watchedAmount) return 'border-gray-300';
    const context = getExpenseContext(watchedAmount);
    if (context.level === 'small' || context.level === 'medium') return 'border-green-400 focus:ring-green-400';
    if (context.level === 'large') return 'border-yellow-400 focus:ring-yellow-400';
    return 'border-red-400 focus:ring-red-400';
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <DollarSign className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">How much did you spend?</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <motion.div
                    animate={{ scale: watchedAmount ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={`text-2xl text-center font-bold ${getAmountInputColor()}`}
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: watchedAmount ? 1 : 0 }}
                    className="absolute -bottom-6 left-0 right-0 text-center"
                  >
                    {watchedAmount && (
                      <Badge variant={
                        getExpenseContext(watchedAmount).level === 'small' || getExpenseContext(watchedAmount).level === 'medium' ? 'default' :
                        getExpenseContext(watchedAmount).level === 'large' ? 'secondary' : 'destructive'
                      }>
                        {getExpenseContext(watchedAmount).description}
                      </Badge>
                    )}
                  </motion.div>
                </div>
                {errors.amount && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center mt-2"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.amount.message}
                  </motion.div>
                )}
              </div>

              <div>
                <Label htmlFor="description">What was it for?</Label>
                <Input
                  id="description"
                  placeholder="e.g., Tea at local cafe"
                  {...register('description')}
                />
                {errors.description && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center mt-2"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description.message}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Tag className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold">Choose a category</h3>
            </div>

            <div className="space-y-4">
              {categories && (
                <AnimatedCategorySelector
                  categories={categories}
                  selectedCategory={watchedCategoryId}
                  onCategorySelect={(categoryId) => setValue('categoryId', categoryId)}
                  recentExpenseAmount={watchedAmount}
                />
              )}
              
              {errors.categoryId && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm flex items-center justify-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.categoryId.message}
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold">Final details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center mt-2"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.date.message}
                  </motion.div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Additional notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details..."
                  {...register('notes')}
                />
              </div>

              {/* Expense Summary */}
              <AnimatedCard className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    Expense Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{watchedAmount ? formatCurrency(watchedAmount) : formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{selectedCategoryPreview?.name || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Description:</span>
                      <span className="font-medium">{watch('description') || 'None'}</span>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AnimatedCard className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add Expense</span>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </CardTitle>
          
          {/* Step Indicator */}
          <div className="flex space-x-2 mt-4">
            {[1, 2, 3].map((stepNum) => (
              <motion.div
                key={stepNum}
                className={`flex-1 h-2 rounded-full ${
                  stepNum <= step ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                animate={{ 
                  backgroundColor: stepNum <= step ? '#3b82f6' : '#e5e7eb',
                  scale: stepNum === step ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <EnhancedButton
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex-1 mr-2"
              >
                Previous
              </EnhancedButton>

              {step < 3 ? (
                <EnhancedButton
                  type="button"
                  onClick={nextStep}
                  disabled={!watchedAmount || (step === 2 && !watchedCategoryId)}
                  className="flex-1 ml-2"
                  glow={!!(watchedAmount && (step !== 2 || watchedCategoryId))}
                >
                  Next
                </EnhancedButton>
              ) : (
                <EnhancedButton
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="flex-1 ml-2"
                  glow={isValid}
                  pulse={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Adding...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Add Expense
                    </>
                  )}
                </EnhancedButton>
              )}
            </div>
          </form>
        </CardContent>
      </AnimatedCard>

      {/* Enhanced Animation System */}
      <ExpenseSuccessAnimation
        isActive={activeAnimations.success}
        amount={animationData.amount || 0}
        category={animationData.category}
        type={animationData.type}
        onComplete={() => {}}
      />

      <RippleEffect
        isActive={activeAnimations.ripple}
        color={animationData.color}
        origin={animationData.origin}
      />

      <FloatingNumber
        isActive={activeAnimations.floating}
        amount={animationData.amount || 0}
        type={animationData.type as 'add' | 'subtract' | 'points' | 'streak'}
        origin={animationData.origin}
      />

      <ConfettiBurst
        isActive={activeAnimations.confetti}
        intensity={animationData.intensity}
        colors={animationData.color ? [animationData.color] : undefined}
      />

      <MoneyRain
        isActive={activeAnimations.moneyRain}
        intensity={animationData.intensity || 'normal'}
        onComplete={() => {}}
      />
    </>
  );
}