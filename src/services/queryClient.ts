import { QueryClient } from '@tanstack/react-query';

// Helper to safely read numeric status from unknown error objects
const getStatus = (error: unknown): number | undefined => {
  if (error && typeof error === 'object') {
    if ('status' in (error as Record<string, unknown>)) {
      const s = (error as Record<string, unknown>).status;
      if (typeof s === 'number') {
        return s;
      }
    }
  }
  return undefined;
};

// Create QueryClient with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: unknown) => {
        const status = getStatus(error);
        // Don't retry on 4xx errors
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: (failureCount: number, error: unknown) => {
        const status = getStatus(error);
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});

// Query keys for future API integration
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
};

export default queryClient;
