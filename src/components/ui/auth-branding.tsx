import { IndianRupee } from 'lucide-react';

function AnimatedRupeeIcon() {
  return (
    <div className="relative">
      <IndianRupee className="h-10 w-10 text-primary drop-shadow-sm animate-float" />
      <div className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full blur-md -z-10"></div>
    </div>
  );
}

function PaisaPaisaTitle() {
  return (
    <span className="text-3xl font-bold text-gradient-moonlight tracking-tight">
      Paisa Paisa
    </span>
  );
}

interface AuthBrandingProps {
  subtitle?: string;
}

export function AuthBranding({ subtitle }: AuthBrandingProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <AnimatedRupeeIcon />
        <PaisaPaisaTitle />
      </div>
      {subtitle && (
        <p className="text-muted-foreground font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}