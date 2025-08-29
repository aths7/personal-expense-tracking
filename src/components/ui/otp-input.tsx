import { useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function OtpInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false, 
  error = false 
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const handleChange = useCallback((index: number, inputValue: string) => {
    if (inputValue.length > 1) {
      // Handle paste
      const pastedValue = inputValue.slice(0, length);
      onChange(pastedValue);
      
      // Focus the last filled input or the last one if all are filled
      const nextIndex = Math.min(pastedValue.length - 1, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input
    const newValue = value.split('');
    newValue[index] = inputValue;
    onChange(newValue.join('').slice(0, length));

    // Move to next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [value, onChange, length]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [value]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={handleFocus}
          disabled={disabled}
          className={`w-12 h-12 text-center text-lg font-semibold bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 ${
            error ? 'border-destructive focus:border-destructive' : ''
          }`}
        />
      ))}
    </div>
  );
}