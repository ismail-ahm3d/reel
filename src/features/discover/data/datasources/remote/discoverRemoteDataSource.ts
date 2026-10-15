import { z } from 'zod';
import type { Clock } from '@shared/core/domain/clock';
import type { HttpClient, QueryParams } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import type { MediaRef, MediaType } from '@shared/domain/model/media';
import {
  imageDtoSchema,
  mediaItemDtoSchema,
  pageDtoSchema,
  type ImageDto,
  type MediaItemDto,
  type PageDto,
} from '@shared/data/datasources/remote/tmdbDto';
import {
  runtimeBounds,
  type BrowseFilters,
  type SortOrder,
} from '@features/discover/domain/model/browseFilters';
import type { Category } from '@features/discover/domain/model/category';

export const providerListDtoSchema = z.object({
  results: z.array(
    z.object({
      provider_id: z.number(),
      provider_name: z.string(),
      logo_path: z.string().nullish(),
      display_priorities: z.record(z.string(), z.number()).nullish(),
    }),
  ),
});

export type ProviderListDto = z.infer<typeof providerListDtoSchema>;

const logoListDtoSchema = z.object({ logos: z.array(imageDtoSchema).nullish() });

/** Every function may throw AppError; nothing else. */
export type DiscoverRemoteDataSource = {
  readonly category: (type: MediaType, category: Category, page: number) => Promise<PageDto<MediaItemDto>>;
  readonly discover: (
    type: MediaType,
    filters: BrowseFilters,
    page: number,
  ) => Promise<PageDto<MediaItemDto>>;
  readonly providers: (type: MediaType) => Promise<ProviderListDto>;
  /** A title's logos in the app language, English or no language, for the featured cards. */
  readonly logos: (ref: MediaRef) => Promise<readonly ImageDto[]>;
};

const pageSchema = pageDtoSchema(mediaItemDtoSchema);

const categoryPath = (type: MediaType, category: Category): string => {
  switch (category) {
    case 'trending':
      return `trending/${type}/week`;
    case 'trendingToday':
      return `trending/${type}/day`;
    case 'nowPlaying':
      return 'movie/now_playing';
    case 'upcoming':
      return 'movie/upcoming';
    case 'airingToday':
      return 'tv/airing_today';
    case 'onTheAir':
      return 'tv/on_the_air';
    case 'popular':
      return `${type}/popular`;
    case 'topRated':
      return `${type}/top_rated`;
  }
};

/**
 * TMDB's sort keys, and the vote floors that keep obscure titles with three votes out of
 * "top rated" and empty placeholder entries out of "newest".
 */
const sortParams = (type: MediaType, sort: SortOrder, today: string): QueryParams => {
  const date = type === 'movie' ? 'primary_release_date' : 'first_air_date';
  switch (sort) {
    case 'popularity':
      return { sort_by: 'popularity.desc' };
    case 'rating':
      return { sort_by: 'vote_average.desc', 'vote_count.gte': 300 };
    case 'votes':
      return { sort_by: 'vote_count.desc' };
    case 'revenue':
      return { sort_by: 'revenue.desc' };
    case 'newest':
      return { sort_by: `${date}.desc`, [`${date}.lte`]: today, 'vote_count.gte': 10 };
    case 'oldest':
      return { sort_by: `${date}.asc`, 'vote_count.gte': 50 };
    case 'title':
      return { sort_by: type === 'movie' ? 'title.asc' : 'name.asc', 'vote_count.gte': 50 };
  }
};

const decadeParams = (type: MediaType, decade: number | null): QueryParams => {
  if (decade === null) return {};
  const date = type === 'movie' ? 'primary_release_date' : 'first_air_date';
  return { [`${date}.gte`]: `${decade}-01-01`, [`${date}.lte`]: `${decade + 9}-12-31` };
};

const sourceParams = (filters: BrowseFilters): QueryParams => {
  const { source } = filters;
  if (source === null) return {};
  switch (source.kind) {
    case 'keyword':
      return { with_keywords: source.id };
    case 'company':
      return { with_companies: source.id };
    case 'network':
      return { with_networks: source.id };
    case 'genre':
      return {};
  }
};

export const makeDiscoverRemoteDataSource = ({
  http,
  clock,
  region,
  language,
}: {
  http: HttpClient;
  clock: Clock;
  region: string;
  /** ISO 639-1, to pick logos in the user's language. */
  language: string;
}): DiscoverRemoteDataSource => ({
  category: (type, category, page) =>
    remoteOutcome(async () => {
      const regional = category === 'nowPlaying' || category === 'upcoming' ? { region } : {};
      return pageSchema.parse(await http.get(categoryPath(type, category), { page, ...regional }));
    }),
  discover: (type, filters, page) =>
    remoteOutcome(async () => {
      const today = clock.now().toISOString().slice(0, 10);
      const runtime = filters.runtime === null ? null : runtimeBounds(type, filters.runtime);
      // The decade bounds come after the sort's, so a decade's upper bound replaces "until today".
      const query: QueryParams = {
        page,
        include_adult: false,
        with_genres: filters.genreIds.join(','),
        'vote_average.gte': filters.minRating,
        // "|" means any of: a title on Netflix or on Prime matches.
        with_watch_providers: filters.providerIds.join('|'),
        watch_region: filters.providerIds.length > 0 ? region : null,
        with_original_language: filters.language,
        'with_runtime.gte': runtime?.min ?? null,
        'with_runtime.lte': runtime?.max ?? null,
        ...sourceParams(filters),
        ...sortParams(type, filters.sort, today),
        ...decadeParams(type, filters.decade),
      };
      return pageSchema.parse(await http.get(`discover/${type}`, query));
    }),
  providers: (type) =>
    remoteOutcome(async () =>
      providerListDtoSchema.parse(await http.get(`watch/providers/${type}`, { watch_region: region })),
    ),
  logos: (ref) =>
    remoteOutcome(
      async () =>
        logoListDtoSchema.parse(
          await http.get(`${ref.type}/${ref.id}/images`, {
            include_image_language: [...new Set([language, 'en', 'null'])].join(','),
          }),
        ).logos ?? [],
    ),
});
