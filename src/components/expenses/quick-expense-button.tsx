'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Zap, 
  Coffee, 
  Utensils, 
  Car, 
  ShoppingBag,
  X,
  Check
} from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { useExpenseAnimations } from '@/hooks/useExpenseAnimations';
import { formatCurrency, getExpenseContext } from '@/lib/currency';

interface QuickExpenseButtonProps {
  className?: string;
}

const quickExpenseTemplates = [
  { icon: Coffee, label: 'Tea/Coffee', amount: 25, categoryName: 'Food & Dining' },
  { icon: Utensils, label: 'Meal', amount: 150, categoryName: 'Food & Dining' },
  { icon: Car, label: 'Transport', amount: 50, categoryName: 'Transportation' },
  { icon: ShoppingBag, label: 'Shopping', amount: 500, categoryName: 'Shopping' },
];

export function QuickExpenseButton({ className = '' }: QuickExpenseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addExpense, expenses } = useExpenses();
  const { categories } = useCategories();
  const {
    triggerExpenseAnimation,
    clearAllAnimations
  } = useExpenseAnimations();

  const handleQuickExpense = async (template: typeof quickExpenseTemplates[0]) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Find the category
      const category = categories?.find(c => c.name === template.categoryName);
      
      if (!category) {
        console.error('Category not found:', template.categoryName);
        return;
      }

      const expense = await addExpense({
        amount: template.amount,
        description: template.label,
        category_id: category.id,
        date: new Date().toISOString().split('T')[0],
      });

      if (expense) {
        // Trigger quick animation for fast entry
        const isFirstExpense = expenses.length === 0;
        const currentStreak = Math.floor(Math.random() * 5) + 1;
        const totalExpenses = expenses.length + 1;
        const expenseContext = getExpenseContext(template.amount);
        
        triggerExpenseAnimation({
          amount: template.amount,
          category: template.categoryName,
          isFirstExpense,
          currentStreak,
          totalExpenses,
          isLargeExpense: false,
          isBudgetBreached: false
        });

        // Close the popup after animation starts
        setTimeout(() => {
          setIsOpen(false);
          clearAllAnimations();
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to add quick expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomExpense = async () => {
    if (isSubmitting || !customAmount || !customDescription) return;
    
    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(customAmount);
      
      // Default to 'Other' category
      const otherCategory = categories?.find(c => c.name === 'Other') || categories?.[0];
      
      if (!otherCategory) {
        console.error('No categories available');
        return;
      }

      const expense = await addExpense({
        amount,
        description: customDescription,
        category_id: otherCategory.id,
        date: new Date().toISOString().split('T')[0],
      });

      if (expense) {
        const isFirstExpense = expenses.length === 0;
        const currentStreak = Math.floor(Math.random() * 5) + 1;
        const totalExpenses = expenses.length + 1;
        const expenseContext = getExpenseContext(amount);
        
        triggerExpenseAnimation({
          amount,
          category: 'Custom',
          isFirstExpense,
          currentStreak,
          totalExpenses,
          isLargeExpense: expenseContext.level === 'large' || expenseContext.level === 'very_large',
          isBudgetBreached: amount > 2000
        });

        // Reset and close
        setCustomAmount('');
        setCustomDescription('');
        setIsCustom(false);
        
        setTimeout(() => {
          setIsOpen(false);
          clearAllAnimations();
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to add custom expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Quick Add Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
          size="lg"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-5 h-5 mr-2" />
          </motion.div>
          Quick Add
          <Zap className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>

      {/* Quick Expense Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2, ease: "backOut" }}
            className="absolute top-full left-0 mt-2 z-50"
          >
            <Card className="w-80 shadow-xl border-2 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Quick Expense</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {!isCustom ? (
                  <>
                    {/* Quick Templates */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {quickExpenseTemplates.map((template, index) => {
                        const IconComponent = template.icon;
                        
                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickExpense(template)}
                            disabled={isSubmitting}
                            className="p-3 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group disabled:opacity-50"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                              <span className="font-medium text-sm">{template.label}</span>
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(template.amount)}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Custom Option */}
                    <Button
                      variant="outline"
                      onClick={() => setIsCustom(true)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Custom Amount
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Custom Expense Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                          type="number"
                          placeholder="₹0.00"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="text-lg font-bold"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input
                          placeholder="What was it for?"
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleCustomExpense}
                          disabled={!customAmount || !customDescription || isSubmitting}
                          className="flex-1"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {isSubmitting ? 'Adding...' : 'Add'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCustom(false);
                            setCustomAmount('');
                            setCustomDescription('');
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Loading State */}
                {isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"
                      />
                      <span className="text-sm font-medium">Adding expense...</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}