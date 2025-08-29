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
          customToast.errorWithRetry(
            error.message || 'Failed to sign in',
            () => onSubmit(data),
            {
              description: 'Please check your credentials and try again'
            }
          );
          return;
        }

        if (user) {
          customToast.success('Successfully signed in!', {
            description: 'Redirecting to your dashboard...'
          });
          router.push(redirectTo);
          router.refresh();
        }
      } else {
        const { user, error } = await authService.signUp(data.email, data.password);

        if (error) {
          customToast.error(error.message || 'Failed to sign up', {
            description: 'Please check your information and try again'
          });
          return;
        }

        if (user) {
          customToast.success('Account created successfully!', {
            description: 'Please check your email for verification before signing in'
          });
          const loginUrl = redirectTo !== '/dashboard' 
            ? `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}` 
            : '/auth/login';
          router.push(loginUrl);
        }
      }
    } catch {
      customToast.error('An unexpected error occurred', {
        description: 'Please try again or contact support if the problem persists'
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