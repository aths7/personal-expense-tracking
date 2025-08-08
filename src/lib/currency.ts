// Currency utilities for the expense tracker

export const CURRENCY = {
  symbol: '₹',
  code: 'INR',
  name: 'Indian Rupee'
};

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
}

export function parseCurrency(value: string): number {
  // Remove currency symbol and parse
  return parseFloat(value.replace(/[₹,]/g, '')) || 0;
}

// Indian currency context for better UX
export const INDIAN_EXPENSE_CONTEXTS = {
  small: { max: 100, description: 'Small expense (Tea, snacks)' },
  medium: { max: 1000, description: 'Medium expense (Meal, transport)' },
  large: { max: 5000, description: 'Large expense (Shopping, bills)' },
  major: { max: 25000, description: 'Major expense (Electronics, rent)' },
  huge: { max: 100000, description: 'Huge expense (Travel, luxury items)' }
};

export function getExpenseContext(amount: number): { level: string; description: string } {
  if (amount <= INDIAN_EXPENSE_CONTEXTS.small.max) {
    return { level: 'small', description: INDIAN_EXPENSE_CONTEXTS.small.description };
  } else if (amount <= INDIAN_EXPENSE_CONTEXTS.medium.max) {
    return { level: 'medium', description: INDIAN_EXPENSE_CONTEXTS.medium.description };
  } else if (amount <= INDIAN_EXPENSE_CONTEXTS.large.max) {
    return { level: 'large', description: INDIAN_EXPENSE_CONTEXTS.large.description };
  } else if (amount <= INDIAN_EXPENSE_CONTEXTS.major.max) {
    return { level: 'major', description: INDIAN_EXPENSE_CONTEXTS.major.description };
  } else {
    return { level: 'huge', description: INDIAN_EXPENSE_CONTEXTS.huge.description };
  }
}