'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-3xl blur-3xl"></div>

        <div className="relative glass-morphism dark:glass-morphism-dark rounded-3xl p-12 lg:p-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
                Ready to Transform Your
                <span className="block text-gradient-moonlight">Financial Future?</span>
              </h2>
            </div>

            <div className="animate-slide-up max-w-2xl mx-auto mb-12" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                Join thousands of professionals who trust our platform to manage their finances with precision and elegance.
              </p>
            </div>

            <div className="animate-slide-up flex flex-col sm:flex-row gap-6 justify-center items-center mb-12" style={{ animationDelay: '0.4s' }}>
              <Button
                asChild
                size="lg"
                className="text-xl font-semibold px-12 py-5 h-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 min-w-[220px]"
              >
                <Link href="/auth/signup">Start Your Journey</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-xl font-medium px-12 py-5 h-auto rounded-full border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-300 hover:-translate-y-1 min-w-[220px]"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>

            <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 text-center" style={{ animationDelay: '0.6s' }}>
              <div className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-primary">1+</div>
                <div className="text-sm text-muted-foreground/70 font-medium">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-accent">99.9%</div>
                <div className="text-sm text-muted-foreground/70 font-medium">Uptime</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-secondary-foreground">24/7</div>
                <div className="text-sm text-muted-foreground/70 font-medium">Fun</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}