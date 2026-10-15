import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountStates } from '@features/account/domain/model/account';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';

/** The user's rating and favorite for a title; null when nobody is signed in. */
export type GetAccountStates = (ref: MediaRef) => Promise<Outcome<AccountStates | null>>;

export const makeGetAccountStates =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): GetAccountStates =>
  (ref) =>
    outcome(async () => {
      const session = await sessions.current();
      return session === null ? null : account.states(session, ref);
    });
