import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingSkeletonProps {
  type?: 'stat-card' | 'list-item' | 'content' | 'spinner';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ type = 'content', count = 1, className = '' }: LoadingSkeletonProps) {
  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (type === 'stat-card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className={`glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              <div className="p-2 rounded-lg bg-primary/10">
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-24 mb-2"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (type === 'list-item') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}