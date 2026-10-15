import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import { isValidRating } from '@features/account/domain/model/account';
import { AccountError } from '@features/account/domain/model/accountError';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

/** Rates a title, or removes the rating with null. Returns the rating now saved. */
export type RateTitle = (ref: MediaRef, value: number | null) => Promise<Outcome<number | null>>;

export const makeRateTitle =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): RateTitle =>
  (ref, value) =>
    outcome(async () => {
      const session = await requireSession(sessions);
      if (value === null) {
        await account.unrate(session, ref);
        return null;
      }
      if (!isValidRating(value)) throw new AccountError({ kind: 'invalidRating' });
      await account.rate(session, ref, value);
      return value;
    });
