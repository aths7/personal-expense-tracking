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

// Enhanced toast utilities with better dismiss functionality
export const customToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      dismissible: options?.dismissible !== false,
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
      duration: options?.duration || 8000, // Longer duration for errors
      dismissible: options?.dismissible !== false,
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

  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      dismissible: options?.dismissible !== false,
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
      duration: options?.duration || 10000, // Longer duration for retry actions
      dismissible: options?.dismissible !== false,
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
    });
  },

  // Persistent toast that stays until manually dismissed
  persistent: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', options?: Omit<ToastOptions, 'duration'>) => {
    const toastFn = type === 'success' ? toast.success 
                  : type === 'error' ? toast.error 
                  : type === 'warning' ? toast.warning 
                  : toast.info;

    return toastFn(message, {
      description: options?.description,
      duration: Infinity, // Stays until dismissed
      dismissible: true,
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