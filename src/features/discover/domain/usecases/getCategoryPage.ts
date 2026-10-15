import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { Category } from '@features/discover/domain/model/category';
import type { DiscoverRepository } from '@features/discover/domain/repositories/discoverRepository';

export type GetCategoryPage = (
  type: MediaType,
  category: Category,
  page: number,
) => Promise<Outcome<Page<MediaSummary>>>;

export const makeGetCategoryPage =
  ({ discover }: { discover: DiscoverRepository }): GetCategoryPage =>
  (type, category, page) =>
    outcome(() => discover.category(type, category, page));
