import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { Account } from '@features/account/domain/model/account';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';

/** The signed-in account, or null when nobody is signed in. */
export type GetAccount = () => Promise<Outcome<Account | null>>;

export const makeGetAccount =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): GetAccount =>
  () =>
    outcome(async () => {
      const session = await sessions.current();
      return session === null ? null : account.account(session);
    });
