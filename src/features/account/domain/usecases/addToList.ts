import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type AddToList = (listId: number, refs: readonly MediaRef[]) => Promise<Outcome<void>>;

export const makeAddToList =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): AddToList =>
  (listId, refs) =>
    outcome(async () => {
      const session = await requireSession(sessions);
      if (refs.length > 0) await account.addToList(session, listId, refs);
    });
