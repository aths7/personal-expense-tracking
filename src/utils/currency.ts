import { CURRENCY_SYMBOL } from '@/constants';

export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};