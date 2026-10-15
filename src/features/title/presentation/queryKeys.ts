import type { MediaRef } from '@shared/domain/model/media';

/** Every query key of the feature, built here and nowhere else. */
export const titleKeys = {
  all: ['title'] as const,
  details: (ref: MediaRef) => ['title', 'details', ref.type, ref.id] as const,
  season: (showId: number, seasonNumber: number) => ['title', 'season', showId, seasonNumber] as const,
  episode: (showId: number, seasonNumber: number, episodeNumber: number) =>
    ['title', 'episode', showId, seasonNumber, episodeNumber] as const,
  collection: (id: number) => ['title', 'collection', id] as const,
  /** The first page only, as the details page shows it. */
  reviewPreview: (ref: MediaRef) => ['title', 'reviewPreview', ref.type, ref.id] as const,
  reviews: (ref: MediaRef) => ['title', 'reviews', ref.type, ref.id] as const,
};
