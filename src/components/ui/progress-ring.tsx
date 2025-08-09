'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  text?: string;
  className?: string;
  animate?: boolean;
}

export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showText = true,
  text,
  className,
  animate = true
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={animate ? { duration: 1, ease: 'easeInOut' } : { duration: 0 }}
        />
      </svg>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={animate ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={animate ? { delay: 0.5, duration: 0.3 } : { duration: 0 }}
            className="text-sm font-semibold text-center"
          >
            {text || `${Math.round(progress)}%`}
          </motion.span>
        </div>
      )}
    </div>
  );
}

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  from,
  to,
  duration = 1,
  prefix = '',
  suffix = '',
  className,
  decimals = 0
}: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ textShadow: '0px 0px 0px rgba(255,255,255,0)' }}
        animate={{ textShadow: '0px 0px 8px rgba(59,130,246,0.5)' }}
        transition={{ duration: 0.1, delay: duration }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration, ease: 'easeOut' }}
        >
          {to.toFixed(decimals)}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  );
}