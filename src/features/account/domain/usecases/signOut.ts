import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';

/** Forgets the session on the device even when TMDB cannot be told: signing out never fails locally. */
export type SignOut = () => Promise<Outcome<void>>;

export const makeSignOut =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): SignOut =>
  () =>
    outcome(async () => {
      const session = await sessions.current();
      await sessions.clear();
      // The result is ignored on purpose: an unreachable TMDB must not keep the user signed in.
      if (session !== null) await outcome(() => account.endSession(session));
    });
