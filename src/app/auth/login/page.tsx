'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import { ArrowLeft, IndianRupee, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        toast.error(error.message || 'Failed to sign in');
        return;
      }

      if (user) {
        toast.success('Successfully signed in!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back Button */}
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <IndianRupee className="h-10 w-10 text-primary drop-shadow-sm animate-float" />
                <div className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full blur-md -z-10"></div>
              </div>
              <span className="text-3xl font-bold text-gradient-moonlight tracking-tight">
                Paisa Paisa
              </span>
            </div>
            <p className="text-muted-foreground font-light">
              Welcome back to your financial journey
            </p>
          </div>

          {/* Sign In Card */}
          <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant backdrop-blur-xl">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">Sign In</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={`h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 ${
                      errors.email ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register('password')}
                      className={`h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 pr-12 ${
                        errors.password ? 'border-destructive focus:border-destructive' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-6 pt-6">
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
                
                <div className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href="/auth/signup" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
                  >
                    Create one here
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}