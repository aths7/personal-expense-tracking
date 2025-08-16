'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Receipt, 
  Tag, 
  IndianRupee,
  Zap,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Current Status',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: Receipt,
  },
  {
    name: 'Quick Expenses',
    href: '/quick-expenses',
    icon: Zap,
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: Tag,
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: BookOpen,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className={cn('h-full w-64 flex flex-col glass-morphism dark:glass-morphism-dark border-r border-border/30', className)}>
      <div className="flex-1 space-y-4 py-6">
        <div className="px-4 py-2">
          {/* App Branding */}
          <Link href="/dashboard" className="flex items-center space-x-3 mb-8 group">
            <div className="relative">
              <IndianRupee className="h-8 w-8 text-primary drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-md -z-10"></div>
            </div>
            <span className="text-2xl font-bold text-gradient-moonlight tracking-tight">
              ₹ Paisa Paisa
            </span>
          </Link>


          <div className="space-y-1">
            <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight text-foreground">
              Navigation
            </h2>
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start h-12 rounded-xl font-medium transition-all duration-300',
                      isActive 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover hover:-translate-y-0.5' 
                        : 'hover:bg-primary/5 hover:text-primary'
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}