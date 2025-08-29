import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategorySectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}

export function CategorySection({ title, description, icon: Icon, children }: CategorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}