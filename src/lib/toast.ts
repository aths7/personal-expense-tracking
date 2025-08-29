import { toast } from 'sonner';

export interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  duration?: number;
  dismissible?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// Color scheme constants
const COLORS = {
  light: '#CCCCFF',
  medium: '#A3A3CC', 
  dark: '#5C5C99',
  darkest: '#292966'
};

// Base toast styling
const baseToastStyle = {
  background: `linear-gradient(135deg, ${COLORS.light} 0%, ${COLORS.medium} 100%)`,
  border: `1px solid ${COLORS.dark}`,
  color: COLORS.darkest,
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  boxShadow: `0 8px 32px rgba(44, 41, 102, 0.3)`,
};

// Enhanced toast utilities with custom color scheme
export const customToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      dismissible: options?.dismissible !== false,
      style: {
        ...baseToastStyle,
        background: `linear-gradient(135deg, ${COLORS.light} 0%, ${COLORS.medium} 100%)`,
        borderLeft: `4px solid #10B981`,
      },
      className: 'custom-success-toast',
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => {}),
      } : {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 8000,
      dismissible: options?.dismissible !== false,
      style: {
        ...baseToastStyle,
        background: `linear-gradient(135deg, ${COLORS.medium} 0%, ${COLORS.dark} 100%)`,
        color: '#FFFFFF',
        borderLeft: `4px solid #EF4444`,
      },
      className: 'custom-error-toast',
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => {}),
      } : {
        label: 'Try Again',
        onClick: () => {},
      },
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      dismissible: options?.dismissible !== false,
      style: {
        ...baseToastStyle,
        background: `linear-gradient(135deg, ${COLORS.light} 0%, ${COLORS.medium} 100%)`,
        borderLeft: `4px solid #F59E0B`,
      },
      className: 'custom-warning-toast',
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => {}),
      } : {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      dismissible: options?.dismissible !== false,
      style: {
        ...baseToastStyle,
        background: `linear-gradient(135deg, ${COLORS.light} 0%, ${COLORS.medium} 100%)`,
        borderLeft: `4px solid #3B82F6`,
      },
      className: 'custom-info-toast',
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => {}),
      } : {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  },

  // Special error toast with retry functionality
  errorWithRetry: (message: string, retryAction: () => void, options?: Omit<ToastOptions, 'action'>) => {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 10000,
      dismissible: options?.dismissible !== false,
      style: {
        ...baseToastStyle,
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkest} 100%)`,
        color: '#FFFFFF',
        borderLeft: `4px solid #EF4444`,
      },
      className: 'custom-error-retry-toast',
      action: {
        label: 'Retry',
        onClick: retryAction,
      },
      cancel: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  },

  // Promise-based toast for async operations
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      duration: 5000,
      dismissible: true,
      style: baseToastStyle,
      className: 'custom-promise-toast',
    });
  },

  // Persistent toast that stays until manually dismissed
  persistent: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', options?: Omit<ToastOptions, 'duration'>) => {
    const toastFn = type === 'success' ? toast.success 
                  : type === 'error' ? toast.error 
                  : type === 'warning' ? toast.warning 
                  : toast.info;

    const persistentStyle = {
      ...baseToastStyle,
      background: type === 'error' 
        ? `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkest} 100%)`
        : `linear-gradient(135deg, ${COLORS.light} 0%, ${COLORS.medium} 100%)`,
      color: type === 'error' ? '#FFFFFF' : COLORS.darkest,
      borderLeft: type === 'success' ? `4px solid #10B981`
                 : type === 'error' ? `4px solid #EF4444`
                 : type === 'warning' ? `4px solid #F59E0B`
                 : `4px solid #3B82F6`,
    };

    return toastFn(message, {
      description: options?.description,
      duration: Infinity,
      dismissible: true,
      style: persistentStyle,
      className: `custom-persistent-${type}-toast`,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      cancel: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  },
};

// Legacy toast interface for backward compatibility
export { toast };