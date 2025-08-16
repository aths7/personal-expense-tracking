'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, ArrowRight } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import type { BlogPost } from '@/types/blog';

export function BlogGrid() {
  const { posts, featuredPosts, categories, loading, error } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass-morphism dark:glass-morphism-dark border border-border/30">
                <CardHeader>
                  <div className="h-48 bg-muted animate-pulse rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-destructive">Failed to load blog posts: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-4">
                ⭐ Editor&apos;s Picks
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">Featured Articles</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our most popular and impactful financial guides, handpicked for maximum value
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {featuredPosts.slice(0, 2).map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">All Articles</h2>
          <p className="text-muted-foreground mb-8">Browse our complete library of financial wisdom</p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
            >
              All Articles
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className="rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* All Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="glass-morphism dark:glass-morphism-dark border border-primary/30 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-r from-primary/20 to-accent/20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="mb-2 bg-primary/90 text-primary-foreground">Featured</Badge>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary/90 transition-colors">
                {post.title}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time} min read</span>
                </span>
              </div>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.published_date).toLocaleDateString()}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-1 text-primary group-hover/card:translate-x-1 transition-transform">
                <span className="text-sm font-medium">Read More</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
        <CardHeader>
          <div className="aspect-video bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center p-4">
              <h3 className="font-semibold text-primary mb-2">{post.category}</h3>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">📊</span>
              </div>
            </div>
          </div>
          
          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.reading_time} min</span>
            </span>
            <span>{new Date(post.published_date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-1 text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Read</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}