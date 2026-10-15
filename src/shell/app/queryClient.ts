import { AppState } from 'react-native';
import { focusManager, QueryClient } from '@tanstack/react-query';
import '@shared/core/presentation/query/register';
import { NetworkError, type AppError } from '@shared/core/domain/appError';

/** Retry only what a second attempt can fix; every other failure goes straight to the screen. */
const isTransient = (error: AppError): boolean =>
  error instanceof NetworkError &&
  (error.failure.kind === 'unreachable' ||
    error.failure.kind === 'timeout' ||
    error.failure.kind === 'server' ||
    error.failure.kind === 'rateLimited');

export const makeQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => failureCount < 2 && isTransient(error),
        // TMDB lists change a few times a day; five minutes keeps tab switches instant.
        staleTime: 5 * 60_000,
      },
      mutations: { retry: false },
    },
  });

/** Refetches stale queries when the app comes back to the foreground. Returns the unsubscribe. */
export const syncQueryFocusWithAppState = (): (() => void) => {
  const subscription = AppState.addEventListener('change', (status) => {
    focusManager.setFocused(status === 'active');
  });
  return () => {
    subscription.remove();
  };
};
