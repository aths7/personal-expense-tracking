'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';
import { blogService } from '@/services/blog';
import type { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
  currentPost: BlogPost;
}

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Get posts from the same category first
        const { data: categoryPosts } = await blogService.getPostsByCategory(currentPost.category);
        
        if (categoryPosts) {
          // Filter out current post and get up to 3 related posts
          const filtered = categoryPosts
            .filter(post => post.id !== currentPost.id)
            .slice(0, 3);
          
          // If we don't have enough posts from the same category, fill with other posts
          if (filtered.length < 3) {
            const { data: allPosts } = await blogService.getAllPosts();
            if (allPosts) {
              const otherPosts = allPosts
                .filter(post => 
                  post.id !== currentPost.id && 
                  !filtered.some(fp => fp.id === post.id)
                )
                .slice(0, 3 - filtered.length);
              
              setRelatedPosts([...filtered, ...otherPosts]);
            } else {
              setRelatedPosts(filtered);
            }
          } else {
            setRelatedPosts(filtered);
          }
        }
      } catch (error) {
        console.error('Failed to fetch related posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPost]);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/30">
        <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-morphism dark:glass-morphism-dark border border-border/30">
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/30">
      <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {relatedPosts.map((post) => (
          <Card 
            key={post.id} 
            className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 group"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.reading_time}m</span>
                </span>
              </div>
              
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button asChild variant="ghost" size="sm" className="w-full group/btn">
                <Link href={`/blog/${post.slug}`} className="flex items-center justify-center space-x-1">
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="glass-morphism dark:glass-morphism-dark border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-8 text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Ready to Start Your Financial Journey?</h3>
        <p className="text-muted-foreground mb-6">
          Join thousands of users who are already taking control of their finances with ₹ Paisa Paisa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/auth/signup">
              Get Started Free
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              Explore More Articles
            </Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}