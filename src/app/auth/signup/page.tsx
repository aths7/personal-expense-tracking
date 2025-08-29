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


function SignupPageContent() {
  const { form, isLoading, onSubmit } = useAuthForm({ type: 'signup' });
  const { register, formState: { errors } } = form;

  return (
    <GuestGuard>
      <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark relative overflow-hidden">
        <BackgroundDecoration />
        <BackToHomeButton />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md animate-slide-up">
            <AuthBranding subtitle="Start your journey to financial clarity" />
            <form onSubmit={onSubmit}>
              <AuthCard
                title="Create Account"
                description="Join thousands who are mastering their finances"
                footer={
                  <>
                    <AuthSubmitButton isLoading={isLoading} loadingText="Creating account...">
                      Create Account
                    </AuthSubmitButton>
                    <AuthFooterLink
                      text="Already have an account?"
                      linkText="Sign in here"
                      href="/auth/login"
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
                  placeholder="Create a strong password"
                  showPasswordToggle={true}
                />
                <AuthInput
                  register={register}
                  errors={errors}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}