'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LandingHeader } from '@/components/layout/landing-header';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesGrid } from '@/components/sections/features-grid';
import { HomeBlogSection } from '@/components/blog/home-blog-section';
import { CTASection } from '@/components/sections/cta-section';
import { LandingFooter } from '@/components/layout/landing-footer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <LandingHeader />
      <main className="relative z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <HeroSection />
          <FeaturesGrid />
        </div>
        <HomeBlogSection />
        <div className="container mx-auto px-6 lg:px-8">
          <CTASection />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
