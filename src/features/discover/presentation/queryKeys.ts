import type { MediaRef, MediaType } from '@shared/domain/model/media';
import type { BrowseFilters } from '@features/discover/domain/model/browseFilters';
import type { Category } from '@features/discover/domain/model/category';

/** Every query key of the feature, built here and nowhere else. Feature first, entity next. */
export const discoverKeys = {
  all: ['discover'] as const,
  /** The first page only, as the home rails show it. */
  preview: (type: MediaType, category: Category) => ['discover', 'preview', type, category] as const,
  /** Every page, as the category grid loads it. */
  category: (type: MediaType, category: Category) => ['discover', 'category', type, category] as const,
  browse: (type: MediaType, filters: BrowseFilters) => ['discover', 'browse', type, filters] as const,
  services: (type: MediaType) => ['discover', 'services', type] as const,
  logo: (ref: MediaRef) => ['discover', 'logo', ref.type, ref.id] as const,
};
