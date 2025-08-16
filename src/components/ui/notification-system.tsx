'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification, 
      clearAll 
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification, clearAll } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    };
    return icons[type];
  };

  const getColors = (type: Notification['type']) => {
    const colors = {
      success: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
      error: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
      warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      info: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    };
    return colors[type];
  };

  const getIconColors = (type: Notification['type']) => {
    const colors = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
    };
    return colors[type];
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {/* Clear All Button */}
      {notifications.length > 1 && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAll}
          className="mb-2 text-xs text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm border border-border/30 rounded-full px-3 py-1 ml-auto block transition-colors"
        >
          Clear All ({notifications.length})
        </motion.button>
      )}
      
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              whileHover={{ scale: 1.02 }}
              layout
              className={cn(
                'relative rounded-xl border p-4 shadow-elegant backdrop-blur-md glass-morphism dark:glass-morphism-dark',
                getColors(notification.type)
              )}
            >
              <div className="flex items-start space-x-3">
                <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', getIconColors(notification.type))} />
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{notification.title}</div>
                  {notification.message && (
                    <div className="text-sm opacity-90 mt-1">{notification.message}</div>
                  )}
                  
                  {notification.action && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-2 text-xs font-medium underline opacity-80 hover:opacity-100"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </motion.button>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 p-1 rounded-full hover:bg-background/20 transition-colors"
                  onClick={() => removeNotification(notification.id)}
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Progress bar for timed notifications */}
              {!notification.persistent && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (notification.duration || 5000) / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Quick notification helpers
export function useQuickNotifications() {
  const { addNotification } = useNotifications();

  return {
    success: (title: string, message?: string) => 
      addNotification({ type: 'success', title, message }),
    error: (title: string, message?: string) => 
      addNotification({ type: 'error', title, message }),
    warning: (title: string, message?: string) => 
      addNotification({ type: 'warning', title, message }),
    info: (title: string, message?: string) => 
      addNotification({ type: 'info', title, message }),
  };
}