import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth';
import { customToast } from '@/lib/toast';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export type AuthFormData = z.infer<typeof authSchema>;

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

  const schema = authSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      if (type === 'login') {
        const { error } = await authService.signIn(data.email);

        if (error) {
          const errorMessage = error?.message ? toTitleCase(error.message) : 'Failed To Send OTP';
          customToast.error(errorMessage, {
            description: 'Please Check Your Email And Try Again'
          });
          return;
        }

        customToast.success('OTP Sent!', {
          description: 'Please Check Your Email For The Verification Code'
        });
        
        // Redirect to OTP verification page
        const verifyUrl = `/auth/verify?email=${encodeURIComponent(data.email)}&type=magiclink${
          redirectTo !== '/dashboard' ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`;
        router.push(verifyUrl);
        
      } else {
        const { error } = await authService.signUp(data.email);

        if (error) {
          const errorMessage = error?.message ? toTitleCase(error.message) : 'Failed To Create Account';
          customToast.error(errorMessage, {
            description: 'Please Check Your Email And Try Again'
          });
          return;
        }

        customToast.success('Verification Email Sent!', {
          description: 'Please Check Your Email To Verify Your Account'
        });
        
        // Redirect to OTP verification page
        const verifyUrl = `/auth/verify?email=${encodeURIComponent(data.email)}&type=signup${
          redirectTo !== '/dashboard' ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`;
        router.push(verifyUrl);
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