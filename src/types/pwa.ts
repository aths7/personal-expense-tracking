// PWA TypeScript definitions

declare global {
  interface Window {
    workbox?: {
      addEventListener: (event: string, callback: (event: any) => void) => void;
      messageSkipWaiting: () => void;
      register: () => Promise<ServiceWorkerRegistration | undefined>;
    };
  }

  interface Navigator {
    standalone?: boolean;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWADisplayMode {
  mode: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
}

export interface ServiceWorkerUpdateEvent {
  type: 'SKIP_WAITING' | 'UPDATE_AVAILABLE' | 'CACHE_UPDATED';
  payload?: any;
}

// PWA Installation state
export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  canPrompt: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

// Service Worker related types
export interface SWUpdateAvailableEvent {
  type: 'SW_UPDATE_AVAILABLE';
  payload: {
    registration: ServiceWorkerRegistration;
    waiting: ServiceWorker;
  };
}

export interface SWOfflineReadyEvent {
  type: 'SW_OFFLINE_READY';
}

export interface SWRegisteredEvent {
  type: 'SW_REGISTERED';
  payload: {
    registration: ServiceWorkerRegistration;
  };
}

export type ServiceWorkerEvent = 
  | SWUpdateAvailableEvent 
  | SWOfflineReadyEvent 
  | SWRegisteredEvent;

// Workbox types for runtime caching
export interface RuntimeCachingRule {
  urlPattern: RegExp | string;
  handler: 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate';
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
  options?: {
    cacheName?: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
      purgeOnQuotaError?: boolean;
    };
    cacheKeyWillBeUsed?: (params: any) => Promise<string>;
    cachedResponseWillBeUsed?: (params: any) => Promise<Response | undefined>;
    requestWillBeFetched?: (params: any) => Promise<Request>;
    fetchDidFail?: (params: any) => Promise<void>;
    fetchDidSucceed?: (params: any) => Promise<Response>;
    networkTimeoutSeconds?: number;
    rangeRequests?: boolean;
  };
}

export interface PWAConfig {
  dest: string;
  register: boolean;
  skipWaiting: boolean;
  disable: boolean;
  runtimeCaching: RuntimeCachingRule[];
  buildExcludes: RegExp[];
  publicExcludes: string[];
}