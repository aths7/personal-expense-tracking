import { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

export function AuthInput({
  register,
  errors,
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  showPasswordToggle = false
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;
  const fieldError = errors[name];

  return (
    <div className="space-y-2 mb-4">
      <div className='ml-2'>
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      </div>
      <div className="relative">
        <Input
          id={name}
          type={inputType}
          placeholder={placeholder}
          {...register(name)}
          className={`h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 ${showPasswordToggle ? 'pr-12' : ''
            } ${fieldError ? 'border-destructive focus:border-destructive' : ''
            } ${className}`}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {fieldError && (
        <p className="text-sm text-destructive mt-1">
          {typeof fieldError.message === 'string'
            ? fieldError.message
            : fieldError.message?.toString() || 'Invalid input'
          }
        </p>
      )}
    </div>
  );
}