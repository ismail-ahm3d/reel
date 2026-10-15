import type { ImageSet } from '@shared/domain/model/imageSet';

export type MediaType = 'movie' | 'tv';

export const mediaTypes: readonly MediaType[] = ['movie', 'tv'];

export const isMediaType = (value: string): value is MediaType => value === 'movie' || value === 'tv';

/** A movie or a show, identified across the app. TMDB ids are only unique within a type. */
export type MediaRef = {
  readonly type: MediaType;
  readonly id: number;
};

export const mediaRefKey = (ref: MediaRef): string => `${ref.type}:${ref.id}`;

export const sameMedia = (a: MediaRef, b: MediaRef): boolean => a.type === b.type && a.id === b.id;

/** What a list, a rail or a search result knows about a title. */
export type MediaSummary = {
  readonly ref: MediaRef;
  readonly title: string;
  readonly overview: string;
  readonly year: number | null;
  /** 0 to 10, one decimal; null when nobody has voted yet. */
  readonly rating: number | null;
  readonly voteCount: number;
  readonly poster: ImageSet | null;
  readonly backdrop: ImageSet | null;
  readonly genreIds: readonly number[];
};

/** One page of a paginated list. Pages start at 1. */
export type Page<T> = {
  readonly items: readonly T[];
  readonly page: number;
  readonly totalPages: number;
  readonly totalResults: number;
};

export const nextPageOf = (page: Page<unknown>): number | undefined =>
  page.page < page.totalPages ? page.page + 1 : undefined;
