import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { ListPage } from '@features/account/domain/model/account';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type GetList = (listId: number, page: number) => Promise<Outcome<ListPage>>;

export const makeGetList =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): GetList =>
  (listId, page) =>
    outcome(async () => account.list(await requireSession(sessions), listId, page));
