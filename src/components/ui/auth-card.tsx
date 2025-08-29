import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="flex flex-col space-y-6 pt-6">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}