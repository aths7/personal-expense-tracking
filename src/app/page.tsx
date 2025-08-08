'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  DollarSign, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Smartphone 
} from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ExpenseTracker
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex space-x-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your{' '}
            <span className="text-green-600">Finances</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Track expenses, analyze spending patterns, and achieve your financial goals 
            with our intuitive expense tracking application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/auth/signup">Start Tracking Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Smart Analytics</CardTitle>
              <CardDescription>
                Visualize your spending with beautiful charts and detailed insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <PieChart className="h-12 w-12 text-purple-600 mb-2" />
              <CardTitle>Category Tracking</CardTitle>
              <CardDescription>
                Organize expenses by categories and see where your money goes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mb-2" />
              <CardTitle>Expense Trends</CardTitle>
              <CardDescription>
                Monitor spending trends and identify patterns over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-2" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your financial data is encrypted and protected with bank-level security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Smartphone className="h-12 w-12 text-orange-600 mb-2" />
              <CardTitle>Mobile Friendly</CardTitle>
              <CardDescription>
                Access your expenses anywhere with our responsive design
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-12 w-12 text-teal-600 mb-2" />
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>
                Set budgets and get insights to help you stay on track
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to start your financial journey?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who are already taking control of their finances.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/auth/signup">Get Started Now</Link>
          </Button>
        </div>
      </main>

      <footer className="border-t bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Personal Expense Tracker. Built with Next.js and Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
