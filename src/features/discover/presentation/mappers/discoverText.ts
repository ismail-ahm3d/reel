import type { MediaType } from '@shared/domain/model/media';
import type { SortOrder } from '@features/discover/domain/model/browseFilters';
import type { Category } from '@features/discover/domain/model/category';

/** The translation key of a category's title. "Popular" reads differently for movies and shows. */
export const categoryTitleKey = (type: MediaType, category: Category): string =>
  `discover.category.${type}.${category}`;

export const sortKey = (sort: SortOrder): string => `discover.sort.${sort}`;
