import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { TitleLogo } from '@shared/domain/model/titleLogo';
import type { DiscoverRepository } from '@features/discover/domain/repositories/discoverRepository';

/** The title card a featured card shows instead of the typed title; null when TMDB has none. */
export type GetTitleLogo = (ref: MediaRef) => Promise<Outcome<TitleLogo | null>>;

export const makeGetTitleLogo =
  ({ discover }: { discover: DiscoverRepository }): GetTitleLogo =>
  (ref) =>
    outcome(() => discover.logo(ref));
