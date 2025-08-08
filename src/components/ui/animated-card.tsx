'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { forwardRef, useRef } from 'react';

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'scale' | 'none';
  clickEffect?: 'ripple' | 'bounce' | 'pulse' | 'none';
  glowColor?: string;
  borderGradient?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    children, 
    hoverEffect = 'lift', 
    clickEffect = 'ripple',
    glowColor = 'rgba(59, 130, 246, 0.5)',
    borderGradient = false,
    ...props 
  }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || hoverEffect !== 'tilt') return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseXPos = e.clientX - rect.left;
      const mouseYPos = e.clientY - rect.top;
      
      mouseX.set((mouseXPos / width) - 0.5);
      mouseY.set((mouseYPos / height) - 0.5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const getHoverAnimation = () => {
      switch (hoverEffect) {
        case 'lift':
          return { y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' };
        case 'scale':
          return { scale: 1.03 };
        case 'glow':
          return { boxShadow: `0 0 20px ${glowColor}` };
        case 'tilt':
          return {};
        default:
          return {};
      }
    };

    const getClickAnimation = () => {
      switch (clickEffect) {
        case 'bounce':
          return { scale: 0.98 };
        case 'pulse':
          return { scale: [1, 1.02, 1] };
        default:
          return {};
      }
    };

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={getHoverAnimation()}
        whileTap={getClickAnimation()}
        style={hoverEffect === 'tilt' ? { rotateX, rotateY } : {}}
        transition={{ duration: 0.2 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="transform-gpu"
      >
        <Card
          ref={ref}
          className={cn(
            'transition-all duration-200',
            borderGradient && 'bg-gradient-to-br from-white to-gray-50 border-gradient-to-r from-blue-200 to-purple-200',
            clickEffect === 'ripple' && 'relative overflow-hidden before:absolute before:inset-0 before:bg-white before:opacity-0 before:scale-0 before:rounded-lg before:transition-all active:before:opacity-10 active:before:scale-100',
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';