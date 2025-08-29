'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { string, z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth';
import { customToast } from '@/lib/toast';
import { GuestGuard } from '@/components/auth/auth-guard';
import { ArrowLeft, IndianRupee, Eye, EyeOff } from 'lucide-react';

import { UseFormRegister, FieldErrors } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function BackGroundDecoration() {
  return (<div className="absolute inset-0 opacity-30">
    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
    <div className="absolute top-40 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-40 left-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
  </div>)
}

function BackToHomeButton() {
  return (
    <>
      <div className="absolute top-6 left-6 z-50 animate-fade-in">
        <Button
          asChild
          variant="ghost"
          className="hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-full glass-morphism dark:glass-morphism-dark"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>
      </div>
    </>
  )
}


function AnimatedRupeeIcon() {
  return (
    <div className="relative">
      <IndianRupee className="h-10 w-10 text-primary drop-shadow-sm animate-float" />
      <div className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full blur-md -z-10"></div>
    </div>
  );
}

function PaisaPaisaTitle() {
  return (
    <span className="text-3xl font-bold text-gradient-moonlight tracking-tight">
      Paisa Paisa
    </span>
  );
}

function IntroText() {
  return (
    <p className="text-muted-foreground font-light">
      Welcome back to your financial journey
    </p>
  )
}


function LogoAndTitle() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <AnimatedRupeeIcon />
        <PaisaPaisaTitle />
      </div>
      <IntroText />
    </div>
  )
}

function CustomCardHeader() {
  return (
    <CardHeader className="space-y-2 text-center pb-6">
      <CardTitle className="text-2xl font-bold text-foreground">Sign In</CardTitle>
      <CardDescription className="text-muted-foreground">
        Enter your credentials to access your account
      </CardDescription>
    </CardHeader>
  )
}

function CustomLabel({ htmlFor, text }: { text?: string, htmlFor?: string }) {
  return (<Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
    {text}
  </Label>
  )
}

interface CustomInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

function CustomInput({
  register,
  errors,
  name,
  type = "text",
  placeholder,
  className = "",
  showPasswordToggle = false
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  const fieldError = errors[name];

  return (
    <div className="relative">
      <Input
        type={inputType}
        placeholder={placeholder}
        {...register(name)} // Pass the field name directly
        className={`h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 ${showPasswordToggle ? 'pr-12' : ''
          } ${fieldError ? 'border-destructive focus:border-destructive' : ''
          } ${className}`}
      />

      {/* Password visibility toggle */}
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

function SignInButton({ isLoading }: { isLoading?: boolean }) {
  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
          Signing in...
        </span>
      ) : (
        'Sign In'
      )}
    </Button>
  )
}

function SignUpButton() {
  return (
    <div className="text-sm text-center text-muted-foreground">
      Don&apos;t have an account?{' '}
      <Link
        href="/auth/signup"
        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
      >
        Create one here
      </Link>
    </div>
  )
}




function LoginPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
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
    } catch {
      customToast.error('An unexpected error occurred', {
        description: 'Please try again or contact support if the problem persists'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
      <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark relative overflow-hidden">
        <BackGroundDecoration />
        <BackToHomeButton />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md animate-slide-up">
            <LogoAndTitle />
            <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant backdrop-blur-xl">
              <CustomCardHeader />
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <CustomLabel htmlFor='email' text='Email Address' />
                    <CustomInput
                      register={register}
                      errors={errors}
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-3">
                    <CustomLabel htmlFor='password' text='Password' />
                    <CustomInput
                      register={register}
                      errors={errors}
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      showPasswordToggle={true}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-6 pt-6">
                  <SignInButton isLoading={isLoading} />
                  <SignUpButton />
                </CardFooter>
              </form>
            </Card>
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