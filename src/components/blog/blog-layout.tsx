'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface BlogLayoutProps {
  children: ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog" className="flex items-center space-x-2">
                  <span>Blog</span>
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-xl font-bold text-gradient-moonlight"
              >
                ₹ Paisa Paisa
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background/50 border-t border-border/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">₹ Paisa Paisa</h3>
              <p className="text-muted-foreground">
                Your trusted companion for personal expense tracking and financial management.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="/auth/signup" className="block text-muted-foreground hover:text-primary transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-4">Financial Topics</h4>
              <div className="space-y-2">
                <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                  Budgeting Tips
                </Link>
                <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                  Expense Tracking
                </Link>
                <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                  Personal Finance
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/30 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ₹ Paisa Paisa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}