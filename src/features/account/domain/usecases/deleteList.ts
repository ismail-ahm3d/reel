import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type DeleteList = (listId: number) => Promise<Outcome<void>>;

export const makeDeleteList =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): DeleteList =>
  (listId) =>
    outcome(async () => account.deleteList(await requireSession(sessions), listId));
