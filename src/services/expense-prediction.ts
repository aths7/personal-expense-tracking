import { createClient } from '@/lib/supabase/client';
import type { Expense, Category } from '@/types';

interface PredictionResult {
  amount: number;
  confidence: number; // 0-1
  category: string;
  reasoning: string;
  historicalBasis: {
    averageAmount: number;
    frequency: number;
    lastAmount: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

interface SpendingPattern {
  categoryId: string;
  categoryName: string;
  averageAmount: number;
  frequency: number; // expenses per month
  dayOfWeek: number[];
  timeOfMonth: 'early' | 'mid' | 'late';
  seasonality: Record<string, number>; // month -> multiplier
}

interface BudgetAlert {
  type: 'warning' | 'danger' | 'info';
  message: string;
  category?: string;
  projectedOverage: number;
  confidence: number;
}

export class ExpensePredictionService {
  private supabase = createClient();

  async analyzeSpendingPatterns(userId: string): Promise<SpendingPattern[]> {
    try {
      const { data: expenses } = await this.supabase
        .from('expenses')
        .select(`
          *,
          categories (name)
        `)
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()) // Last year
        .order('created_at', { ascending: false });

      if (!expenses) return [];

      const categoryGroups = this.groupByCategory(expenses);
      const patterns: SpendingPattern[] = [];

      for (const [categoryId, categoryExpenses] of Object.entries(categoryGroups)) {
        const pattern = this.analyzeCategory(categoryId, categoryExpenses);
        if (pattern) patterns.push(pattern);
      }

      return patterns.sort((a, b) => b.frequency - a.frequency);
    } catch (error) {
      console.error('Error analyzing spending patterns:', error);
      return [];
    }
  }

  async predictNextExpenses(userId: string, days: number = 7): Promise<PredictionResult[]> {
    const patterns = await this.analyzeSpendingPatterns(userId);
    const predictions: PredictionResult[] = [];

    const currentDate = new Date();
    
    for (const pattern of patterns) {
      const probability = this.calculateExpenseProbability(pattern, days);
      
      if (probability > 0.3) { // Only predict if >30% likely
        const prediction = this.generatePrediction(pattern, probability, currentDate);
        predictions.push(prediction);
      }
    }

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  async generateBudgetAlerts(userId: string): Promise<BudgetAlert[]> {
    try {
      const predictions = await this.predictNextExpenses(userId, 30);
      const alerts: BudgetAlert[] = [];

      // Get current month spending
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyExpenses } = await this.supabase
        .from('expenses')
        .select(`
          amount,
          categories (name, color)
        `)
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

      if (!monthlyExpenses) return alerts;

      const currentSpending = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
      const predictedSpending = predictions.reduce((sum, p) => sum + p.amount, 0);
      const projectedTotal = currentSpending + predictedSpending;

      // Mock budget data - in real app this would come from user's budget settings
      const monthlyBudget = 50000; // ₹50,000 monthly budget

      if (projectedTotal > monthlyBudget) {
        alerts.push({
          type: 'danger',
          message: `Projected to exceed monthly budget by ₹${(projectedTotal - monthlyBudget).toLocaleString('en-IN')}`,"
          projectedOverage: projectedTotal - monthlyBudget,
          confidence: 0.8
        });
      } else if (projectedTotal > monthlyBudget * 0.85) {
        alerts.push({
          type: 'warning',
          message: `Approaching monthly budget limit (${((projectedTotal / monthlyBudget) * 100).toFixed(1)}%)`,
          projectedOverage: 0,
          confidence: 0.9
        });
      }

      // Category-specific alerts
      const categorySpending = this.groupExpensesByCategory(monthlyExpenses);
      const categoryBudgets = {
        'Food & Dining': 15000,   // ₹15,000 for food
        'Transportation': 8000,   // ₹8,000 for transport
        'Entertainment': 5000,    // ₹5,000 for entertainment
        'Shopping': 12000         // ₹12,000 for shopping
      };

      for (const [category, budget] of Object.entries(categoryBudgets)) {
        const spent = categorySpending[category] || 0;
        const categoryPredictions = predictions.filter(p => p.category === category);
        const predictedCategorySpending = categoryPredictions.reduce((sum, p) => sum + p.amount, 0);
        const projectedCategoryTotal = spent + predictedCategorySpending;

        if (projectedCategoryTotal > budget) {
          alerts.push({
            type: 'warning',
            message: `${category} spending may exceed budget by ₹${(projectedCategoryTotal - budget).toLocaleString('en-IN')}`,"
            category,
            projectedOverage: projectedCategoryTotal - budget,
            confidence: categoryPredictions.length > 0 ? 0.7 : 0.5
          });
        }
      }

      return alerts;
    } catch (error) {
      console.error('Error generating budget alerts:', error);
      return [];
    }
  }

  async getSmartSuggestions(userId: string): Promise<string[]> {
    const patterns = await this.analyzeSpendingPatterns(userId);
    const suggestions: string[] = [];

    // Analyze patterns and generate suggestions
    for (const pattern of patterns) {
      if (pattern.frequency > 10 && pattern.averageAmount > 50) {
        suggestions.push(`Consider setting a monthly limit for ${pattern.categoryName} (avg: ₹${pattern.averageAmount.toLocaleString('en-IN')}/expense)`);
      }

      if (pattern.trend === 'increasing') {
        suggestions.push(`Your ${pattern.categoryName} spending is trending upward - review recent purchases`);
      }

      // Day-of-week patterns
      if (pattern.dayOfWeek.length <= 2) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const days = pattern.dayOfWeek.map(d => dayNames[d]).join(' and ');
        suggestions.push(`You typically spend on ${pattern.categoryName} on ${days} - plan accordingly`);
      }
    }

    // General financial health suggestions
    const totalMonthlySpending = patterns.reduce((sum, p) => sum + (p.averageAmount * p.frequency), 0);
    
    if (totalMonthlySpending > 40000) {
      suggestions.push('Consider reviewing your largest expense categories for potential savings');
    }

    suggestions.push('Track your daily expenses to identify micro-spending patterns');
    suggestions.push('Set category-specific budgets based on your spending history');

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  private groupByCategory(expenses: any[]): Record<string, any[]> {
    return expenses.reduce((groups, expense) => {
      const categoryId = expense.category_id;
      if (!groups[categoryId]) groups[categoryId] = [];
      groups[categoryId].push(expense);
      return groups;
    }, {});
  }

  private groupExpensesByCategory(expenses: any[]): Record<string, number> {
    return expenses.reduce((groups, expense) => {
      const categoryName = expense.categories?.name || 'Other';
      groups[categoryName] = (groups[categoryName] || 0) + expense.amount;
      return groups;
    }, {});
  }

  private analyzeCategory(categoryId: string, expenses: any[]): SpendingPattern | null {
    if (expenses.length < 3) return null; // Need at least 3 data points

    const amounts = expenses.map(e => e.amount);
    const averageAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    
    // Calculate frequency (expenses per month)
    const oldestDate = new Date(Math.min(...expenses.map(e => new Date(e.created_at).getTime())));
    const newestDate = new Date(Math.max(...expenses.map(e => new Date(e.created_at).getTime())));
    const monthsDiff = Math.max(1, (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const frequency = expenses.length / monthsDiff;

    // Analyze day of week patterns
    const dayCount = new Array(7).fill(0);
    expenses.forEach(expense => {
      const day = new Date(expense.created_at).getDay();
      dayCount[day]++;
    });
    const dayOfWeek = dayCount.map((count, index) => ({ day: index, count }))
      .filter(d => d.count > expenses.length * 0.2) // Days with >20% of expenses
      .map(d => d.day);

    // Calculate trend
    const recent = expenses.slice(0, Math.min(5, Math.floor(expenses.length / 2)));
    const older = expenses.slice(-Math.min(5, Math.floor(expenses.length / 2)));
    const recentAvg = recent.reduce((sum, e) => sum + e.amount, 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + e.amount, 0) / older.length;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentAvg > olderAvg * 1.15) trend = 'increasing';
    else if (recentAvg < olderAvg * 0.85) trend = 'decreasing';

    // Time of month analysis
    const timeOfMonth = this.analyzeTimeOfMonth(expenses);

    // Seasonality analysis (simplified)
    const seasonality = this.analyzeSeasonality(expenses);

    return {
      categoryId,
      categoryName: expenses[0].categories?.name || 'Unknown',
      averageAmount,
      frequency,
      dayOfWeek,
      timeOfMonth,
      seasonality
    };
  }

  private calculateExpenseProbability(pattern: SpendingPattern, days: number): number {
    // Base probability from frequency
    const dailyProbability = pattern.frequency / 30;
    const probability = dailyProbability * days;
    
    // Adjust based on day of week
    if (pattern.dayOfWeek.length <= 3) {
      // If spending is concentrated on specific days, increase probability
      const currentWeekDayMatches = pattern.dayOfWeek.includes(new Date().getDay());
      return Math.min(probability * (currentWeekDayMatches ? 1.3 : 0.8), 1);
    }

    return Math.min(probability, 1);
  }

  private generatePrediction(pattern: SpendingPattern, confidence: number, currentDate: Date): PredictionResult {
    // Adjust amount based on trend
    let predictedAmount = pattern.averageAmount;
    if (pattern.trend === 'increasing') predictedAmount *= 1.1;
    else if (pattern.trend === 'decreasing') predictedAmount *= 0.9;

    // Adjust for seasonality
    const currentMonth = currentDate.getMonth().toString();
    const seasonalMultiplier = pattern.seasonality[currentMonth] || 1;
    predictedAmount *= seasonalMultiplier;

    // Generate reasoning
    const reasoning = this.generateReasoning(pattern, confidence);

    return {
      amount: Math.round(predictedAmount * 100) / 100,
      confidence,
      category: pattern.categoryName,
      reasoning,
      historicalBasis: {
        averageAmount: pattern.averageAmount,
        frequency: pattern.frequency,
        lastAmount: pattern.averageAmount, // Simplified
        trend: pattern.trend
      }
    };
  }

  private generateReasoning(pattern: SpendingPattern, confidence: number): string {
    const reasons = [];
    
    if (pattern.frequency > 8) {
      reasons.push('frequent spending pattern');
    }
    
    if (pattern.dayOfWeek.length <= 3) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      reasons.push(`typically spent on ${pattern.dayOfWeek.map(d => days[d]).join(', ')}`);
    }
    
    if (pattern.trend === 'increasing') {
      reasons.push('increasing trend');
    }
    
    if (confidence > 0.7) {
      reasons.push('high historical consistency');
    }

    return `Based on ${reasons.join(', ')}`;
  }

  private analyzeTimeOfMonth(expenses: any[]): 'early' | 'mid' | 'late' {
    const dayDistribution = { early: 0, mid: 0, late: 0 };
    
    expenses.forEach(expense => {
      const day = new Date(expense.created_at).getDate();
      if (day <= 10) dayDistribution.early++;
      else if (day <= 20) dayDistribution.mid++;
      else dayDistribution.late++;
    });

    const max = Math.max(...Object.values(dayDistribution));
    return Object.keys(dayDistribution).find(key => dayDistribution[key as keyof typeof dayDistribution] === max) as 'early' | 'mid' | 'late';
  }

  private analyzeSeasonality(expenses: any[]): Record<string, number> {
    const monthCounts = new Array(12).fill(0);
    expenses.forEach(expense => {
      const month = new Date(expense.created_at).getMonth();
      monthCounts[month]++;
    });

    const average = monthCounts.reduce((sum, count) => sum + count, 0) / 12;
    const seasonality: Record<string, number> = {};
    
    monthCounts.forEach((count, month) => {
      seasonality[month.toString()] = count > 0 ? count / average : 1;
    });

    return seasonality;
  }
}

export const expensePredictionService = new ExpensePredictionService();