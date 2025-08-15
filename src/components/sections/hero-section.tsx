'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="text-center max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
            <span className="block text-foreground mb-2">Take Control</span>
            <span className="block text-foreground mb-2">of Your</span>
            <span className="block text-gradient-moonlight">
              Paisa
            </span>
          </h1>
        </div>

        <div className="animate-slide-up max-w-3xl mx-auto mb-12" style={{ animationDelay: '0.2s' }}>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
            Your Money. Your Clarity. Your Goals. No Selling. No Distractions.
            <span className="block mt-2">
              Track everything, understand patterns, make smarter decisions.
            </span>
          </p>
        </div>

        <div className="animate-slide-up flex flex-col sm:flex-row gap-6 justify-center items-center mb-16" style={{ animationDelay: '0.4s' }}>
          <Button
            asChild
            size="lg"
            className="text-lg font-semibold px-10 py-4 h-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 min-w-[200px]"
          >
            <Link href="/auth/signup">Start Free Trial</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg font-medium px-10 py-4 h-auto rounded-full border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-300 hover:-translate-y-1 min-w-[200px]"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground/70">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-xs sm:text-sm">No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span className="text-xs sm:text-sm">14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full"></div>
              <span className="text-xs sm:text-sm">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}