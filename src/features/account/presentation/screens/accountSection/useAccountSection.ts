import { useQuery } from '@tanstack/react-query';
import { getOrThrow } from '@shared/core/domain/outcome';
import type { Account } from '@features/account/domain/model/account';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { useSignIn, type SignInState } from '@features/account/presentation/hooks/useSignIn';
import { accountKeys } from '@features/account/presentation/queryKeys';

export type AccountSectionProps = {
  readonly useCases: AccountUseCases;
};

export type AccountSectionView = {
  readonly account: Account | null;
  readonly isLoading: boolean;
  readonly signIn: SignInState;
};

/** The account block of the Settings sheet; a slot the settings route fills. */
export const useAccountSection = ({ useCases }: AccountSectionProps): AccountSectionView => {
  const me = useQuery({
    queryKey: accountKeys.me,
    queryFn: async () => getOrThrow(await useCases.getAccount()),
  });
  return { account: me.data ?? null, isLoading: me.isPending, signIn: useSignIn(useCases) };
};
