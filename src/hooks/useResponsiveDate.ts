import { useState, useEffect } from 'react';

interface DateFormats {
  full: string;
  short: string;
}

export function useResponsiveDate(): DateFormats {
  const [dates, setDates] = useState<DateFormats>({
    full: '',
    short: ''
  });

  useEffect(() => {
    const now = new Date();
    
    const full = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const short = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    setDates({ full, short });
  }, []);

  return dates;
}