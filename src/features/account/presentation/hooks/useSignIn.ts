import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { successFeedback } from '@shared/core/presentation/feedback/haptics';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { isDeclinedSignIn } from '@features/account/presentation/mappers/accountErrorText';

export type SignInState = {
  readonly isSigningIn: boolean;
  readonly isSigningOut: boolean;
  readonly error: AppError | null;
  readonly signIn: () => void;
  readonly signOut: () => void;
  readonly dismissError: () => void;
};

/**
 * Signing in and out, shared by the screens that offer it. Either way every cached query is
 * stale: the watchlist, ratings and lists belong to someone else now.
 */
export const useSignIn = (useCases: AccountUseCases): SignInState => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<AppError | null>(null);
  const refreshEverything = () => {
    void queryClient.invalidateQueries();
  };

  const signIn = useMutation({
    mutationFn: async () => getOrThrow(await useCases.signIn()),
    onMutate: () => {
      setError(null);
    },
    onSuccess: () => {
      successFeedback();
      refreshEverything();
    },
    // Closing the TMDB page is a choice, not a failure worth a banner.
    onError: (failure) => {
      setError(isDeclinedSignIn(failure) ? null : failure);
    },
  });

  const signOut = useMutation({
    mutationFn: async () => getOrThrow(await useCases.signOut()),
    onSuccess: refreshEverything,
    onError: setError,
  });

  return {
    isSigningIn: signIn.isPending,
    isSigningOut: signOut.isPending,
    error,
    signIn: () => {
      signIn.mutate();
    },
    signOut: () => {
      signOut.mutate();
    },
    dismissError: () => {
      setError(null);
    },
  };
};
