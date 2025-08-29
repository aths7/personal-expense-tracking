'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuestGuard } from '@/components/auth/auth-guard';
import { BackgroundDecoration } from '@/components/ui/background-decoration';
import { BackToHomeButton } from '@/components/ui/back-to-home-button';
import { AuthBranding } from '@/components/ui/auth-branding';
import { AuthCard } from '@/components/ui/auth-card';
import { AuthSubmitButton } from '@/components/ui/auth-submit-button';
import { AuthFooterLink } from '@/components/ui/auth-footer-link';
import { OtpInput } from '@/components/ui/otp-input';
import { authService } from '@/services/auth';
import { customToast } from '@/lib/toast';

function VerifyOtpPageContent() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'signup' | 'magiclink'>('magiclink');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const typeParam = searchParams.get('type') as 'signup' | 'magiclink';

    if (!emailParam) {
      router.push('/auth/login');
      return;
    }

    setEmail(emailParam);
    setType(typeParam || 'magiclink');
  }, [searchParams, router]);

  const handleVerifyOtp = async (otpValue?: string) => {
    const codeToVerify = otpValue || otp;
    if (codeToVerify.length !== 6) {
      customToast.error('Please enter the complete OTP code');
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await authService.verifyOtp(email, codeToVerify, type);

      if (error) {
        customToast.error(error.message || 'Invalid OTP code', {
          description: 'Please check the code and try again'
        });
        return;
      }

      if (user) {
        customToast.success(
          type === 'signup' ? 'Account verified successfully!' : 'Successfully signed in!',
          {
            description: 'Redirecting to your dashboard...'
          }
        );
        
        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      customToast.error('An unexpected error occurred', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      if (type === 'signup') {
        await authService.signUp(email);
      } else {
        await authService.signIn(email);
      }
      
      customToast.success('OTP code resent!', {
        description: 'Please check your email for the new code'
      });
    } catch {
      customToast.error('Failed to resend OTP', {
        description: 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <GuestGuard>
      <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark relative overflow-hidden">
        <BackgroundDecoration />
        <BackToHomeButton />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md animate-slide-up">
            <AuthBranding subtitle="Enter the verification code sent to your email" />
            <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
              <AuthCard 
                title="Verify Your Email"
                description={`We've sent a 6-digit code to ${email}`}
                footer={
                  <>
                    <AuthSubmitButton 
                      isLoading={isLoading} 
                      loadingText="Verifying..."
                    >
                      Verify Code
                    </AuthSubmitButton>
                    
                    <div className="text-center space-y-2">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline disabled:opacity-50"
                      >
                        Didn't receive the code? Resend
                      </button>
                      
                      <AuthFooterLink 
                        text="Want to use a different email?"
                        linkText="Go back"
                        href={type === 'signup' ? '/auth/signup' : '/auth/login'}
                      />
                    </div>
                  </>
                }
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <OtpInput 
                      value={otp}
                      onChange={(value) => {
                        setOtp(value);
                        // Auto-submit when 6 digits are entered
                        if (value.length === 6 && !isLoading) {
                          setTimeout(() => handleVerifyOtp(value), 100);
                        }
                      }}
                      disabled={isLoading}
                      error={false}
                    />
                  </div>
                </div>
              </AuthCard>
            </form>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}