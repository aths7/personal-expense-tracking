'use client';

import { Suspense } from 'react';
import { GuestGuard } from '@/components/auth/auth-guard';
import { BackgroundDecoration } from '@/components/ui/background-decoration';
import { BackToHomeButton } from '@/components/ui/back-to-home-button';
import { AuthBranding } from '@/components/ui/auth-branding';
import { AuthCard } from '@/components/ui/auth-card';
import { AuthInput } from '@/components/ui/auth-input';
import { AuthSubmitButton } from '@/components/ui/auth-submit-button';
import { AuthFooterLink } from '@/components/ui/auth-footer-link';
import { useAuthForm } from '@/hooks/useAuthForm';



function LoginPageContent() {
  const { form, isLoading, onSubmit } = useAuthForm({ type: 'login' });
  const { register, formState: { errors } } = form;

  return (
    <GuestGuard>
      <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark relative overflow-hidden">
        <BackgroundDecoration />
        <BackToHomeButton />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md animate-slide-up">
            <AuthBranding subtitle="Welcome back to your financial journey" />
            <form onSubmit={onSubmit}>
              <AuthCard 
                title="Sign In"
                description="Enter your credentials to access your account"
                footer={
                  <>
                    <AuthSubmitButton isLoading={isLoading} loadingText="Signing in...">
                      Sign In
                    </AuthSubmitButton>
                    <AuthFooterLink 
                      text="Don't have an account?"
                      linkText="Create one here"
                      href="/auth/signup"
                    />
                  </>
                }
              >
                <AuthInput
                  register={register}
                  errors={errors}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                />
                <AuthInput
                  register={register}
                  errors={errors}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  showPasswordToggle={true}
                />
              </AuthCard>
            </form>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}