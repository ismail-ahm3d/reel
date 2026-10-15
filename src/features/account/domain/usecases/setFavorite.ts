import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type SetFavorite = (ref: MediaRef, favorite: boolean) => Promise<Outcome<boolean>>;

export const makeSetFavorite =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): SetFavorite =>
  (ref, favorite) =>
    outcome(async () => {
      await account.setFavorite(await requireSession(sessions), ref, favorite);
      return favorite;
    });
