import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth';
import { customToast } from '@/lib/toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

interface UseAuthFormOptions {
  type: 'login' | 'signup';
}

// Helper function to convert string to title case
const toTitleCase = (str: string): string => {
  if (!str || typeof str !== 'string') return str || '';
  const cleaned = str.trim();
  if (!cleaned) return '';
  return cleaned.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export function useAuthForm({ type }: UseAuthFormOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const schema = type === 'login' ? loginSchema : signupSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setIsLoading(true);

    try {
      if (type === 'login') {
        const { user, error } = await authService.signIn(data.email, data.password);

        if (error) {
          const errorMessage = error?.message ? toTitleCase(error.message) : 'Login Failed';
          customToast.errorWithRetry(
            errorMessage,
            () => onSubmit(data),
            {
              description: 'Try Again',
            }
          );
          return;
        }

        if (user) {
          customToast.success('Successfully Signed In!', {
            description: 'Redirecting To Your Dashboard...'
          });
          router.push(redirectTo);
          router.refresh();
        }
      } else {
        const { user, error } = await authService.signUp(data.email, data.password);

        if (error) {
          const errorMessage = error?.message ? toTitleCase(error.message) : 'Failed To Sign Up';
          customToast.error(errorMessage, {
            description: 'Please Check Your Information And Try Again'
          });
          return;
        }

        if (user) {
          customToast.success('Account Created Successfully!', {
            description: 'Please Check Your Email For Verification Before Signing In'
          });
          const loginUrl = redirectTo !== '/dashboard' 
            ? `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}` 
            : '/auth/login';
          router.push(loginUrl);
        }
      }
    } catch {
      customToast.error('An Unexpected Error Occurred', {
        description: 'Please Try Again Or Contact Support If The Problem Persists'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}