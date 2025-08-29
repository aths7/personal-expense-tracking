import { Button } from '@/components/ui/button';

interface AuthSubmitButtonProps {
  isLoading?: boolean;
  loadingText: string;
  children: React.ReactNode;
}

export function AuthSubmitButton({ isLoading = false, loadingText, children }: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}