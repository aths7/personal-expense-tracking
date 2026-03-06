import Link from 'next/link';
import { LandingHeader } from '@/components/layout/landing-header';
import { LandingFooter } from '@/components/layout/landing-footer';

export const metadata = {
  title: 'Privacy Policy - Paisa Paisa',
  description: 'Privacy Policy for Paisa Paisa personal expense tracking application.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark">
      <LandingHeader />
      <main className="container mx-auto px-6 lg:px-8 py-16 max-w-4xl">
        <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-8 lg:p-12 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gradient-moonlight">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm">Last updated: March 6, 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us when you create an account, such as your email address and password. We also collect financial data you enter into the app, including expense records, categories, and budget goals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process your transactions, send you technical notices and support messages, and respond to your comments and questions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using Supabase, a trusted cloud database provider. We implement industry-standard security measures including encryption at rest and in transit, Row Level Security (RLS) policies ensuring only you can access your data, and regular security audits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share aggregated, anonymized data that does not identify any individual for analytics and service improvement purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of your data or ask us to restrict processing of your data by contacting us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to maintain your session and remember your preferences such as theme settings. These are essential for the application to function correctly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any significant changes by posting a notice in the application or sending you an email. Your continued use of the service after changes are made constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this privacy policy or our data practices, please contact us through the support page.
            </p>
          </section>

          <div className="pt-4 border-t border-white/10 dark:border-white/5">
            <Link
              href="/"
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium text-sm"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
