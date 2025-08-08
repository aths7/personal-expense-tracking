'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface EnhancedButtonProps extends React.ComponentProps<typeof Button> {
  ripple?: boolean;
  glow?: boolean;
  pulse?: boolean;
  shake?: boolean;
  bounceOnClick?: boolean;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, ripple = true, glow = false, pulse = false, shake = false, bounceOnClick = true, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={bounceOnClick ? { scale: 0.95 } : {}}
        animate={pulse ? { scale: [1, 1.05, 1] } : shake ? { x: [-2, 2, -2, 2, 0] } : {}}
        transition={pulse ? { duration: 2, repeat: Infinity } : shake ? { duration: 0.5 } : { duration: 0.2 }}
      >
        <Button
          ref={ref}
          className={cn(
            'relative overflow-hidden transition-all duration-200',
            glow && 'shadow-lg hover:shadow-xl',
            ripple && 'before:absolute before:inset-0 before:bg-white before:opacity-0 before:scale-0 before:rounded-full before:transition-all hover:before:opacity-20 hover:before:scale-100',
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';