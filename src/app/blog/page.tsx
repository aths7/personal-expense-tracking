import { Metadata } from 'next';
import { BlogLayout } from '@/components/blog/blog-layout';
import { BlogGrid } from '@/components/blog/blog-grid';
import { BlogHero } from '@/components/blog/blog-hero';

export const metadata: Metadata = {
  title: 'Financial Blog - Expert Tips on Money Management | ₹ Paisa Paisa',
  description: 'Discover expert financial advice, budgeting tips, and money management strategies. Read our comprehensive guides on personal finance, savings, and expense tracking.',
  keywords: 'personal finance blog, budgeting tips, money management, expense tracking, financial advice, savings strategies',
  openGraph: {
    title: 'Financial Blog - Expert Tips on Money Management',
    description: 'Discover expert financial advice, budgeting tips, and money management strategies.',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <BlogLayout>
      <BlogHero />
      <BlogGrid />
    </BlogLayout>
  );
}