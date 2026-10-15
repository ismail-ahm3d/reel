import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { BrowseFilters } from '@features/discover/domain/model/browseFilters';
import type { DiscoverRepository } from '@features/discover/domain/repositories/discoverRepository';

export type BrowseTitles = (
  type: MediaType,
  filters: BrowseFilters,
  page: number,
) => Promise<Outcome<Page<MediaSummary>>>;

export const makeBrowseTitles =
  ({ discover }: { discover: DiscoverRepository }): BrowseTitles =>
  (type, filters, page) =>
    outcome(() => discover.browse(type, filters, page));
