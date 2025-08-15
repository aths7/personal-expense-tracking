'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Check, IndianRupee } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';

const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectAfterSubmit?: boolean;
}

export function ExpenseModal({ isOpen, onClose, redirectAfterSubmit = false }: ExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addExpense } = useExpenses();
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategoryId = watch('category_id');
  const amount = watch('amount');

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    
    try {
      const expense = await addExpense({
        amount: data.amount,
        description: data.description,
        category_id: data.category_id,
        date: data.date,
      });

      if (expense) {
        toast.success('Expense added successfully!');
        reset();
        onClose();
        
        // Redirect to expenses page only if requested (from dashboard)
        if (redirectAfterSubmit) {
          router.push('/expenses');
        }
      }
    } catch (error) {
      toast.error('Failed to add expense');
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
              className="w-full max-w-md"
            >
              <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IndianRupee className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">Add Expense</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClose}
                      className="hover:bg-primary/10 hover:text-primary rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                        Amount *
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register('amount', { valueAsNumber: true })}
                          className={`pl-10 text-lg font-semibold bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 ${
                            errors.amount ? 'border-destructive focus:border-destructive' : ''
                          }`}
                        />
                      </div>
                      {amount && amount > 0 && (
                        <p className="text-sm text-primary font-medium">
                          {formatCurrency(amount)}
                        </p>
                      )}
                      {errors.amount && (
                        <p className="text-sm text-destructive font-medium">{errors.amount.message}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-foreground">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="What was this expense for?"
                        {...register('description')}
                        className={`bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 resize-none ${
                          errors.description ? 'border-destructive focus:border-destructive' : ''
                        }`}
                        rows={2}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive font-medium">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-foreground">
                        Category *
                      </Label>
                      <Select
                        value={selectedCategoryId}
                        onValueChange={(value) => setValue('category_id', value)}
                      >
                        <SelectTrigger className={`bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 hover:bg-background/70 ${
                          errors.category_id ? 'border-destructive focus:border-destructive' : ''
                        }`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-elegant rounded-lg z-50">
                          {categories?.map((category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id}
                              className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-border/20"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-foreground font-medium">{category.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && (
                        <p className="text-sm text-destructive font-medium">{errors.category_id.message}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium text-foreground">
                        Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        {...register('date')}
                        className={`bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 ${
                          errors.date ? 'border-destructive focus:border-destructive' : ''
                        }`}
                      />
                      {errors.date && (
                        <p className="text-sm text-destructive font-medium">{errors.date.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1 border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-full"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full"
                            />
                            Adding...
                          </div>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Add Expense
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}