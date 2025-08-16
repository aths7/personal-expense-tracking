'use client';

import { useState, useEffect, useCallback } from 'react';
import { blogService } from '@/services/blog';
import type { BlogPost, BlogCategory } from '@/types/blog';

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPosts = useCallback(async () => {
    try {
      const { data, error } = await blogService.getAllPosts();
      if (error) {
        setError(error.message);
        return;
      }
      setPosts(data || []);
    } catch (err) {
      setError('Failed to fetch blog posts');
    }
  }, []);

  const fetchFeaturedPosts = useCallback(async (limit = 3) => {
    try {
      const { data, error } = await blogService.getFeaturedPosts(limit);
      if (error) {
        setError(error.message);
        return;
      }
      setFeaturedPosts(data || []);
    } catch (err) {
      setError('Failed to fetch featured posts');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await blogService.getCategories();
      if (error) {
        setError(error.message);
        return;
      }
      setCategories(data || []);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchAllPosts(),
        fetchFeaturedPosts(),
        fetchCategories()
      ]);
      
      setLoading(false);
    };

    loadInitialData();
  }, [fetchAllPosts, fetchFeaturedPosts, fetchCategories]);

  return {
    posts,
    featuredPosts,
    categories,
    loading,
    error,
    refetch: fetchAllPosts,
    fetchFeaturedPosts,
  };
};

export const useBlogPost = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await blogService.getPostBySlug(slug);
        if (error) {
          setError(error.message);
          return;
        }
        setPost(data);
      } catch (err) {
        setError('Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};

export const useBlogSearch = () => {
  const [results, setResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPosts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await blogService.searchPosts(query);
      if (error) {
        setError(error.message);
        return;
      }
      setResults(data || []);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, searchPosts };
};