import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  children?: ReactNode;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  children 
}: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <div className="text-gray-400">
        <Icon className="h-12 w-12 mx-auto mb-4" />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick}>
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}