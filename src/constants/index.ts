export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', color: '#FF6B6B', icon: 'UtensilsCrossed' },
  { name: 'Transportation', color: '#4ECDC4', icon: 'Car' },
  { name: 'Entertainment', color: '#45B7D1', icon: 'Gamepad2' },
  { name: 'Bills & Utilities', color: '#FFA07A', icon: 'Receipt' },
  { name: 'Shopping', color: '#98D8C8', icon: 'ShoppingBag' },
  { name: 'Healthcare', color: '#F7DC6F', icon: 'Heart' },
  { name: 'Education', color: '#BB8FCE', icon: 'GraduationCap' },
  { name: 'Travel', color: '#85C1E9', icon: 'Plane' },
  { name: 'Groceries', color: '#82E0AA', icon: 'Apple' },
  { name: 'Other', color: '#D5DBDB', icon: 'MoreHorizontal' },
];

export const CURRENCY_SYMBOL = '$';

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  MONTH_YEAR: 'MMM yyyy',
};

export const EXPENSE_LIMITS = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
  MAX_DESCRIPTION_LENGTH: 500,
};

export const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA', '#D5DBDB',
];

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  CATEGORIES: '/categories',
  AUTH: '/auth',
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
};