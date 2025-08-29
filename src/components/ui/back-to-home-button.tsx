import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackToHomeButton() {
  return (
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
  );
}