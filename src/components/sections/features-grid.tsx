'use client';

import {
  IndianRupee,
  Eye,
  TrendingUp,
  Calculator,
  CreditCard,
  PiggyBank,
  Zap,
  Brain,
} from 'lucide-react';

const features = [
  {
    icon: IndianRupee,
    title: 'Gamified Goal Tracking',
    description: 'Achievement-based financial goals with progress tracking, behavioral rewards, and personalized challenges for iPad savings, responsible spending, or concert funds',
    color: 'text-primary',
    gradient: 'from-primary/20 to-primary/5'
  },
  {
    icon: Eye,
    title: 'Unified Financial View',
    description: 'Single dashboard for all accounts, credit cards, stocks, and FDs without the distraction - pure focus on your money, not platform profits',
    color: 'text-accent',
    gradient: 'from-accent/20 to-accent/5'
  },
  {
    icon: TrendingUp,
    title: 'Smart Expense Intelligence',
    description: 'AI-powered spend categorization with budget alerts, overspending notifications, and conscious spending insights to reduce post-splurge guilt',
    color: 'text-secondary-foreground',
    gradient: 'from-secondary/20 to-secondary/5'
  },
  {
    icon: Calculator,
    title: 'Tax Planning Assistant',
    description: 'Automated tax calculations for old vs new regimes, document storage, and proactive tax-saving recommendations with market updates',
    color: 'text-primary',
    gradient: 'from-primary/20 to-primary/5'
  },
  {
    icon: CreditCard,
    title: 'Multi-Account Automation',
    description: 'Email-based transaction processing across banks and credit cards with intelligent categorization and reimbursement tracking',
    color: 'text-accent',
    gradient: 'from-accent/20 to-accent/5'
  },
  {
    icon: PiggyBank,
    title: 'Debt & Investment Tracker',
    description: 'Comprehensive loan analysis with effective interest rates, EMI tracking, and stock portfolio monitoring for complete financial health',
    color: 'text-secondary-foreground',
    gradient: 'from-secondary/20 to-secondary/5'
  },
  {
    icon: Zap,
    title: 'Zero-Effort Updates',
    description: 'Minimal manual input required - designed for busy professionals who want maximum financial insight with minimal time investment',
    color: 'text-primary',
    gradient: 'from-primary/20 to-primary/5'
  },
  {
    icon: Brain,
    title: 'Decision Intelligence',
    description: 'Smart recommendations for major purchases like cars or hiring help, with data-driven insights to make you financially smarter',
    color: 'text-accent',
    gradient: 'from-accent/20 to-accent/5'
  }
];

export function FeaturesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="text-center mb-20 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
          Premium Financial
          <span className="block text-gradient-moonlight">Management</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Professional-grade tools designed for the modern financial professional
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden glass-morphism dark:glass-morphism-dark rounded-2xl p-6 lg:p-8 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 hover:-translate-y-0.5 animate-slide-up border border-border/30 hover:border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-6 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="relative bg-background/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                      <IconComponent className={`h-8 w-8 ${feature.color} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-base lg:text-lg font-light group-hover:text-muted-foreground/90 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Subtle gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-2xl -z-10`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}