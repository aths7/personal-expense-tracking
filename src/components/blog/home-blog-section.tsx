'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';

export function HomeBlogSection() {
  const { featuredPosts, loading, error } = useBlog();

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-moonlight mb-4">
              Financial Insights & Tips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn from our expert guides on budgeting, saving, and money management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-morphism dark:glass-morphism-dark border border-border/30">
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !featuredPosts.length) {
    return null; // Don't show section if there's an error or no posts
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-moonlight">
              Financial Insights & Tips
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn from our expert guides on budgeting, saving, and money management to achieve your financial goals
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredPosts.slice(0, 3).map((post) => (
            <Card 
              key={post.id} 
              className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-2 group"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-primary/10 text-primary">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.reading_time} min read</span>
                  </span>
                </div>
                
                <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.published_date).toLocaleDateString()}
                  </span>
                  <Button asChild variant="ghost" size="sm" className="group/btn">
                    <Link href={`/blog/${post.slug}`} className="flex items-center space-x-1">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass-morphism dark:glass-morphism-dark border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Want More Financial Tips?
            </h3>
            <p className="text-muted-foreground mb-6">
              Explore our complete library of financial guides, budgeting strategies, and money management tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/blog">
                  Explore All Articles
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">
                  Start Tracking Now
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}