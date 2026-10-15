import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaType, Page } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { RatedTitle } from '@features/account/domain/model/account';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type GetRated = (type: MediaType, page: number) => Promise<Outcome<Page<RatedTitle>>>;

export const makeGetRated =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): GetRated =>
  (type, page) =>
    outcome(async () => account.rated(await requireSession(sessions), type, page));
