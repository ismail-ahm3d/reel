import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import { requireSession } from '@features/account/domain/usecases/requireSession';

/** TMDB's picks for this user, from what they rated and saved. */
export type GetRecommendations = (type: MediaType, page: number) => Promise<Outcome<Page<MediaSummary>>>;

export const makeGetRecommendations =
  ({ account, sessions }: { account: AccountRepository; sessions: SessionRepository }): GetRecommendations =>
  (type, page) =>
    outcome(async () => account.recommendations(await requireSession(sessions), type, page));
