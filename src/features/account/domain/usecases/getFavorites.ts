import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

export type GetFavorites = (type: MediaType, page: number) => Promise<Outcome<Page<MediaSummary>>>;

export const makeGetFavorites =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): GetFavorites =>
  (type, page) =>
    outcome(async () => account.favorites(await requireSession(sessions), type, page));
