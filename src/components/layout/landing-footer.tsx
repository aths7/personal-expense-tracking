'use client';

export function LandingFooter() {
  return (
    <footer className="relative z-10 mt-24">
      <div className="glass-morphism dark:glass-morphism-dark border-t border-white/10 dark:border-white/5">
        <div className="container mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Logo and tagline */}
            <div className="text-center animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-gradient-moonlight tracking-tight">
                  Paisa Paisa
                </span>
              </div>
              <p className="text-muted-foreground/80 font-light">
                Professional financial management, elegantly designed
              </p>
            </div>
            
            {/* Divider */}
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>
            
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8 text-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                Support
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                Documentation
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-center text-sm text-muted-foreground/70 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="font-light">
                &copy; 2024 Personal Expense Tracker. Crafted with care using Next.js and Supabase.
              </p>
              <p className="mt-2 text-xs opacity-75">
                Made with ❤️ for financial professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}