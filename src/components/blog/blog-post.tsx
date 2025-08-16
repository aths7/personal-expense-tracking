'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from 'lucide-react';
import type { BlogPost as BlogPostType } from '@/types/blog';

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could show a toast notification here
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="group">
          <Link href="/blog" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center space-x-2 mb-4">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {post.category}
          </Badge>
          {post.is_featured && (
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
              Featured
            </Badge>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.published_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{post.reading_time} min read</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={sharePost}
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 p-4 sm:p-6 lg:p-8">
            <div 
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                prose-headings:text-foreground prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-ul:mb-4 prose-ol:mb-4
                prose-li:text-muted-foreground prose-li:mb-1
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-a:text-primary prose-a:underline prose-a:decoration-primary/30 hover:prose-a:decoration-primary prose-a:underline-offset-2 prose-a:transition-colors
                prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl
                prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl
                prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </Card>
        </div>

        {/* Sidebar - Hidden on mobile, shown as bottom section */}
        <div className="lg:col-span-1 order-first lg:order-last">
          {/* Mobile: Tags at top */}
          <div className="lg:hidden mb-6">
            <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 p-4">
              <h3 className="font-semibold text-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Desktop: Sticky sidebar */}
          <div className="hidden lg:block sticky top-24 space-y-6">
            {/* Table of Contents */}
            <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>In This Article</span>
              </h3>
              <nav className="space-y-2 max-h-80 overflow-y-auto">
                {extractHeadings(post.content).map((heading, index) => (
                  <a
                    key={index}
                    href={`#${heading.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 border-l-2 border-transparent hover:border-primary/30 pl-3"
                    style={{ marginLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </Card>

            {/* Tags */}
            <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 p-6">
              <h3 className="font-semibold text-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <Card className="glass-morphism dark:glass-morphism-dark border border-primary/30 p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="font-semibold text-foreground mb-2">Start Tracking Today</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ready to take control of your finances? Get started with ₹ Paisa Paisa.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/signup">
                  Get Started Free
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile: Bottom CTA */}
      <div className="lg:hidden mt-8">
        <Card className="glass-morphism dark:glass-morphism-dark border border-primary/30 p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="font-semibold text-foreground mb-2 text-center">Start Tracking Today</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Ready to take control of your finances? Get started with ₹ Paisa Paisa.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/signup">
              Get Started Free
            </Link>
          </Button>
        </Card>
      </div>
    </article>
  );
}

function formatContent(content: string): string {
  // Convert markdown-style content to HTML
  return content
    .replace(/^# (.*$)/gim, '<h1 id="$1">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>')
    .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/^\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|l])/gm, '<p>')
    .replace(/(?![h|l]>)$/gm, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6])/g, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<li)/g, '<ul>$1')
    .replace(/(<\/li>)<\/p>/g, '$1</ul>');
}

function extractHeadings(content: string) {
  const headingRegex = /^(#{1,3})\s+(.*$)/gim;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    headings.push({ level, text, id });
  }

  return headings;
}