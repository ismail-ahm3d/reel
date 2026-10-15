import type { MediaRef, MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { TitleLogo } from '@shared/domain/model/titleLogo';
import type { BrowseFilters } from '@features/discover/domain/model/browseFilters';
import type { Category } from '@features/discover/domain/model/category';
import type { StreamingService } from '@features/discover/domain/model/watchProvider';

/** Every function may throw AppError; nothing else. */
export type DiscoverRepository = {
  readonly category: (type: MediaType, category: Category, page: number) => Promise<Page<MediaSummary>>;
  readonly browse: (type: MediaType, filters: BrowseFilters, page: number) => Promise<Page<MediaSummary>>;
  /** Services in the user's region, the region's most used first. */
  readonly streamingServices: (type: MediaType) => Promise<readonly StreamingService[]>;
  /** The title card in the user's language when there is one; null when TMDB has no logo. */
  readonly logo: (ref: MediaRef) => Promise<TitleLogo | null>;
};
