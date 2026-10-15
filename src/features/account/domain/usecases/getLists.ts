import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { Page } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { UserList } from '@features/account/domain/model/account';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type GetLists = (page: number) => Promise<Outcome<Page<UserList>>>;

export const makeGetLists =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): GetLists =>
  (page) =>
    outcome(async () => account.lists(await requireSession(sessions), page));
