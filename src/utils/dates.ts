import { format, startOfMonth, endOfMonth, subMonths, parseISO, isValid } from 'date-fns';
import { DATE_FORMATS } from '@/constants';

export const formatDate = (date: Date | string, formatStr = DATE_FORMATS.DISPLAY): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr);
};

export const formatInputDate = (date: Date | string): string => {
  return formatDate(date, DATE_FORMATS.INPUT);
};

export const getCurrentMonth = () => {
  const now = new Date();
  return {
    start: formatInputDate(startOfMonth(now)),
    end: formatInputDate(endOfMonth(now)),
  };
};

export const getLastMonth = () => {
  const lastMonth = subMonths(new Date(), 1);
  return {
    start: formatInputDate(startOfMonth(lastMonth)),
    end: formatInputDate(endOfMonth(lastMonth)),
  };
};

export const getMonthName = (date: Date | string): string => {
  return formatDate(date, DATE_FORMATS.MONTH_YEAR);
};