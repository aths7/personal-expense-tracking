import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/services/blog';
import { BlogLayout } from '@/components/blog/blog-layout';
import { BlogPost } from '@/components/blog/blog-post';
import { RelatedPosts } from '@/components/blog/related-posts';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await blogService.getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | ₹ Paisa Paisa Blog`,
    description: post.meta_description,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      publishedTime: post.published_date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description,
    },
  };
}

export async function generateStaticParams() {
  const { data: posts } = await blogService.getAllPosts();
  
  if (!posts) return [];
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { data: post } = await blogService.getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <BlogLayout>
      <BlogPost post={post} />
      <RelatedPosts currentPost={post} />
    </BlogLayout>
  );
}