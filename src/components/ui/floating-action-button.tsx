'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FloatingAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
  mainIcon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FloatingActionButton({ 
  actions, 
  mainIcon = <Plus className="w-6 h-6" />,
  position = 'bottom-right',
  size = 'md',
  className 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const getActionPosition = (index: number) => {
    const baseOffset = size === 'sm' ? 60 : size === 'md' ? 70 : 80;
    const offset = baseOffset * (index + 1);
    
    if (position.includes('bottom')) {
      return { bottom: offset };
    }
    return { top: offset };
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
            className="absolute"
            style={getActionPosition(index)}
          >
            <div className="flex items-center gap-3 mb-2">
              {position.includes('right') && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap"
                >
                  {action.label}
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="sm"
                  className={cn(
                    'w-12 h-12 rounded-full shadow-lg',
                    action.color || 'bg-blue-500 hover:bg-blue-600'
                  )}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                >
                  {action.icon}
                </Button>
              </motion.div>
              
              {position.includes('left') && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap"
                >
                  {action.label}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          className={cn(
            sizeClasses[size],
            'rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : mainIcon}
        </Button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}