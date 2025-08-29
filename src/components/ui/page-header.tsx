import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  dateInfo?: string;
  gradient?: boolean;
  actions?: ReactNode;
  responsive?: boolean;
}

export function PageHeader({ 
  title, 
  subtitle, 
  dateInfo, 
  gradient = false, 
  actions, 
  responsive = true 
}: PageHeaderProps) {
  return (
    <div className={`flex ${responsive ? 'flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0' : 'justify-between items-center'}`}>
      <div className="space-y-2">
        <div className={responsive ? 'flex flex-col sm:flex-row sm:items-center gap-3' : 'flex items-center gap-3'}>
          <h1 className={`${responsive ? 'text-2xl sm:text-3xl' : 'text-3xl'} font-bold tracking-tight ${gradient ? 'text-gradient-moonlight' : ''}`}>
            {title}
          </h1>
          {dateInfo && (
            <div className="px-3 py-1 glass-morphism dark:glass-morphism-dark rounded-full border border-primary/20 w-fit">
              <p className="text-sm font-medium text-primary">
                <span className="hidden sm:inline">
                  {dateInfo.split('|')[0]}
                </span>
                <span className="sm:hidden">
                  {dateInfo.split('|')[1]}
                </span>
              </p>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}