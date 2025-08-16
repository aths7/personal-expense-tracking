'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { IndianRupee, Menu, X } from 'lucide-react';

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-morphism dark:glass-morphism-dark border-b border-white/10 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="relative">
              <IndianRupee className="h-8 w-8 lg:h-9 lg:w-9 text-primary drop-shadow-sm animate-float" />
              <div className="absolute inset-0 h-8 w-8 lg:h-9 lg:w-9 bg-primary/20 rounded-full blur-md -z-10"></div>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-gradient-moonlight tracking-tight">
              Paisa Paisa
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 animate-fade-in">
            <nav className="flex items-center space-x-1">
              <Button 
                asChild 
                variant="ghost" 
                className="hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-all duration-300 font-medium px-4 lg:px-6 py-2.5 rounded-full text-foreground dark:text-foreground"
              >
                <Link href="/blog">Blog</Link>
              </Button>
            </nav>
            <ThemeToggle />
            <div className="flex space-x-3">
              <Button 
                asChild 
                variant="ghost" 
                className="hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-all duration-300 font-medium px-4 lg:px-6 py-2.5 rounded-full text-foreground dark:text-foreground"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 lg:px-6 py-2.5 rounded-full shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground dark:text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground dark:text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-4 space-y-3">
              <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-center hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-all duration-300 font-medium py-3 rounded-full text-foreground dark:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/blog">Blog</Link>
              </Button>
              <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-center hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-all duration-300 font-medium py-3 rounded-full text-foreground dark:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-full shadow-elegant transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}