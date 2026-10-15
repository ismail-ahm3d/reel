import type { MediaType } from '@shared/domain/model/media';

/** A curated list TMDB maintains. Some exist for one type only. */
export type Category =
  | 'trending'
  | 'trendingToday'
  | 'nowPlaying'
  | 'upcoming'
  | 'popular'
  | 'topRated'
  | 'airingToday'
  | 'onTheAir';

/** Trending is measured over a day or a week. */
export type TrendingPeriod = 'day' | 'week';

const byType: Readonly<Record<MediaType, readonly Category[]>> = {
  movie: ['trending', 'nowPlaying', 'popular', 'upcoming', 'topRated'],
  tv: ['trending', 'airingToday', 'onTheAir', 'popular', 'topRated'],
};

export const categoriesOf = (type: MediaType): readonly Category[] => byType[type];

export const isCategoryOf = (type: MediaType, value: string): value is Category =>
  value === 'trendingToday' || (byType[type] as readonly string[]).includes(value);
