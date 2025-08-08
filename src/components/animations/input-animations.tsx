'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputWrapperProps {
  children: ReactNode;
  isActive?: boolean;
  hasValue?: boolean;
  isError?: boolean;
  className?: string;
  pulseOnFocus?: boolean;
}

export const AnimatedInputWrapper = forwardRef<HTMLDivElement, AnimatedInputWrapperProps>(
  ({ children, isActive, hasValue, isError, className, pulseOnFocus = true }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("relative", className)}
        animate={{
          scale: isActive && pulseOnFocus ? 1.02 : 1,
          opacity: isActive ? 1 : hasValue ? 1 : 0.9
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut"
        }}
        whileHover={{
          scale: 1.01
        }}
      >
        {children}
        
        {/* Glow Effect */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 rounded-md blur-sm -z-10",
              isError 
                ? "bg-red-200" 
                : hasValue 
                  ? "bg-green-200" 
                  : "bg-blue-200"
            )}
          />
        )}

        {/* Success Checkmark */}
        {hasValue && !isError && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AnimatedInputWrapper.displayName = 'AnimatedInputWrapper';

// Floating Label Animation
interface FloatingLabelProps {
  children: ReactNode;
  isFloating: boolean;
  className?: string;
}

export function FloatingLabel({ children, isFloating, className }: FloatingLabelProps) {
  return (
    <motion.label
      animate={{
        fontSize: isFloating ? "0.75rem" : "1rem",
        y: isFloating ? -20 : 0,
        color: isFloating ? "#6B7280" : "#9CA3AF"
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }}
      className={cn(
        "absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none origin-left",
        className
      )}
    >
      {children}
    </motion.label>
  );
}

// Typing Animation for Input Values
interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TypingAnimation({ text, speed = 50, className }: TypingAnimationProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: index * (speed / 1000),
            duration: 0.1
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Currency Input Animation
interface CurrencyInputAnimationProps {
  amount: number;
  isActive?: boolean;
  className?: string;
}

export function CurrencyInputAnimation({ amount, isActive, className }: CurrencyInputAnimationProps) {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return (
    <motion.div
      className={cn("relative", className)}
      animate={{
        scale: isActive ? 1.05 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        key={amount} // Re-render when amount changes
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-2xl font-bold text-green-600"
      >
        {formattedAmount}
      </motion.span>
      
      {/* Sparkle Effect for Large Amounts */}
      {amount > 1000 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 1.2],
            rotate: 360
          }}
          transition={{
            duration: 1,
            delay: 0.3,
            repeat: isActive ? Infinity : 0,
            repeatDelay: 2
          }}
          className="absolute -top-2 -right-2"
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  );
}

// Form Step Progress Animation
interface StepProgressProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function StepProgress({ totalSteps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn("flex space-x-2", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <motion.div
            key={stepNumber}
            className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={cn(
                "h-full rounded-full",
                isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-200"
              )}
              initial={{ width: "0%" }}
              animate={{ 
                width: isCompleted ? "100%" : isActive ? "100%" : "0%",
                backgroundColor: isCompleted ? "#10B981" : isActive ? "#3B82F6" : "#E5E7EB"
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut",
                delay: isActive ? 0.2 : 0
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// Button Loading Animation
interface ButtonLoadingProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}

export function ButtonLoading({ isLoading, children, className }: ButtonLoadingProps) {
  return (
    <motion.div
      className={cn("flex items-center justify-center", className)}
      animate={{
        scale: isLoading ? 0.95 : 1
      }}
    >
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
      )}
      {children}
    </motion.div>
  );
}