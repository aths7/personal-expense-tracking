'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useBlogSearch } from '@/hooks/useBlog';
import Link from 'next/link';

export function BlogHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, searchPosts } = useBlogSearch();
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchPosts(searchQuery);
      setShowResults(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowResults(false);
    }
  };

  return (
    <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            Financial Wisdom Hub
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gradient-moonlight mb-8 leading-tight">
            Master Your
            <br />
            <span className="text-primary">Money Journey</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover expert financial advice, proven budgeting strategies, and actionable money management tips to transform your financial future.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Search articles on budgeting, savings, investments..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="pr-14 h-14 text-lg bg-background/90 backdrop-blur-sm border-2 border-border/30 focus:border-primary/60 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 placeholder:text-muted-foreground/60"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-3 top-3 h-8 w-8 p-0 rounded-xl bg-primary hover:bg-primary/90 shadow-md"
                  disabled={loading}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            {/* Search Results */}
            {showResults && (
              <Card className="absolute top-full left-0 right-0 mt-2 p-4 bg-background/95 backdrop-blur-sm border-border/50 z-10">
                {loading ? (
                  <p className="text-muted-foreground text-center py-4">Searching...</p>
                ) : results.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {results.slice(0, 5).map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block p-3 rounded-lg hover:bg-primary/5 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <h4 className="font-medium text-foreground">{post.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                      </Link>
                    ))}
                    {results.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        {results.length - 5} more results...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No articles found for &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="group p-8 glass-morphism dark:glass-morphism-dark border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3 text-center">Smart Budgeting</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Master proven budgeting techniques and strategies that actually work for real people in real situations.
            </p>
          </Card>
          
          <Card className="group p-8 glass-morphism dark:glass-morphism-dark border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3 text-center">Expert Insights</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Deep-dive articles from financial experts covering everything from basics to advanced money strategies.
            </p>
          </Card>
          
          <Card className="group p-8 glass-morphism dark:glass-morphism-dark border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3 text-center">Goal Achievement</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Practical guides to setting, tracking, and achieving your financial goals with actionable steps.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}