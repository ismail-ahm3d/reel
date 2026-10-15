import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type RemoveFromList = (listId: number, refs: readonly MediaRef[]) => Promise<Outcome<void>>;

export const makeRemoveFromList =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): RemoveFromList =>
  (listId, refs) =>
    outcome(async () => {
      const session = await requireSession(sessions);
      if (refs.length > 0) await account.removeFromList(session, listId, refs);
    });
