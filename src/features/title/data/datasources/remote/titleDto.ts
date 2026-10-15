import { z } from 'zod';
import {
  companyDtoSchema,
  externalIdsDtoSchema,
  genreDtoSchema,
  imageDtoSchema,
  mediaItemDtoSchema,
} from '@shared/data/datasources/remote/tmdbDto';

const listOf = <Item extends z.ZodType>(item: Item) => z.array(item).nullish();

const videoDtoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean().nullish(),
});

const providerDtoSchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string().nullish(),
  display_priority: z.number().nullish(),
});

const regionProvidersDtoSchema = z.object({
  link: z.string().nullish(),
  flatrate: listOf(providerDtoSchema),
  free: listOf(providerDtoSchema),
  ads: listOf(providerDtoSchema),
  rent: listOf(providerDtoSchema),
  buy: listOf(providerDtoSchema),
});

const resultsOf = <Item extends z.ZodType>(item: Item) => z.object({ results: z.array(item) }).nullish();

const castDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string().nullish(),
  profile_path: z.string().nullish(),
});

const crewDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string().nullish(),
  department: z.string().nullish(),
  profile_path: z.string().nullish(),
});

export const reviewDtoSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
  created_at: z.string().nullish(),
  url: z.string(),
  author_details: z
    .object({
      rating: z.number().nullish(),
      avatar_path: z.string().nullish(),
      username: z.string().nullish(),
    })
    .nullish(),
});

const reviewPageShape = {
  page: z.number(),
  results: z.array(reviewDtoSchema),
  total_pages: z.number(),
  total_results: z.number(),
};

export const reviewPageDtoSchema = z.object(reviewPageShape);

/** Fields movies and shows share, including what append_to_response adds. */
const commonDetailsShape = {
  id: z.number(),
  overview: z.string().nullish(),
  tagline: z.string().nullish(),
  backdrop_path: z.string().nullish(),
  poster_path: z.string().nullish(),
  genres: listOf(genreDtoSchema),
  vote_average: z.number().nullish(),
  vote_count: z.number().nullish(),
  status: z.string().nullish(),
  original_language: z.string().nullish(),
  homepage: z.string().nullish(),
  production_companies: listOf(companyDtoSchema),
  videos: resultsOf(videoDtoSchema),
  recommendations: resultsOf(mediaItemDtoSchema),
  similar: resultsOf(mediaItemDtoSchema),
  images: z
    .object({
      logos: listOf(imageDtoSchema),
      backdrops: listOf(imageDtoSchema),
      posters: listOf(imageDtoSchema),
    })
    .nullish(),
  external_ids: externalIdsDtoSchema.nullish(),
  'watch/providers': z.object({ results: z.record(z.string(), regionProvidersDtoSchema) }).nullish(),
};

export const movieDetailsDtoSchema = z.object({
  ...commonDetailsShape,
  title: z.string(),
  original_title: z.string().nullish(),
  release_date: z.string().nullish(),
  runtime: z.number().nullish(),
  budget: z.number().nullish(),
  revenue: z.number().nullish(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullish(),
      backdrop_path: z.string().nullish(),
    })
    .nullish(),
  credits: z.object({ cast: z.array(castDtoSchema), crew: z.array(crewDtoSchema) }).nullish(),
  keywords: z.object({ keywords: listOf(z.object({ id: z.number(), name: z.string() })) }).nullish(),
  release_dates: resultsOf(
    z.object({
      iso_3166_1: z.string(),
      release_dates: z.array(
        z.object({
          certification: z.string().nullish(),
          type: z.number().nullish(),
          release_date: z.string().nullish(),
          note: z.string().nullish(),
        }),
      ),
    }),
  ),
});

export type MovieDetailsDto = z.infer<typeof movieDetailsDtoSchema>;

export const tvDetailsDtoSchema = z.object({
  ...commonDetailsShape,
  name: z.string(),
  original_name: z.string().nullish(),
  first_air_date: z.string().nullish(),
  last_air_date: z.string().nullish(),
  episode_run_time: listOf(z.number()),
  number_of_seasons: z.number().nullish(),
  number_of_episodes: z.number().nullish(),
  networks: listOf(companyDtoSchema),
  created_by: listOf(z.object({ id: z.number(), name: z.string(), profile_path: z.string().nullish() })),
  seasons: listOf(
    z.object({
      season_number: z.number(),
      name: z.string().nullish(),
      episode_count: z.number().nullish(),
      air_date: z.string().nullish(),
      poster_path: z.string().nullish(),
    }),
  ),
  next_episode_to_air: z
    .object({
      season_number: z.number(),
      episode_number: z.number(),
      name: z.string().nullish(),
      air_date: z.string().nullish(),
    })
    .nullish(),
  aggregate_credits: z
    .object({
      cast: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          profile_path: z.string().nullish(),
          total_episode_count: z.number().nullish(),
          roles: listOf(z.object({ character: z.string().nullish(), episode_count: z.number().nullish() })),
        }),
      ),
      crew: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          department: z.string().nullish(),
          profile_path: z.string().nullish(),
          jobs: listOf(z.object({ job: z.string() })),
        }),
      ),
    })
    .nullish(),
  keywords: z.object({ results: listOf(z.object({ id: z.number(), name: z.string() })) }).nullish(),
  content_ratings: resultsOf(z.object({ iso_3166_1: z.string(), rating: z.string().nullish() })),
});

export type TvDetailsDto = z.infer<typeof tvDetailsDtoSchema>;

export type RegionProvidersDto = z.infer<typeof regionProvidersDtoSchema>;
export type ProviderDto = z.infer<typeof providerDtoSchema>;
export type VideoDto = z.infer<typeof videoDtoSchema>;
export type ReviewDto = z.infer<typeof reviewDtoSchema>;
export type ReviewPageDto = z.infer<typeof reviewPageDtoSchema>;
export type CastDto = z.infer<typeof castDtoSchema>;
export type CrewDto = z.infer<typeof crewDtoSchema>;

export const seasonDtoSchema = z.object({
  season_number: z.number(),
  name: z.string().nullish(),
  overview: z.string().nullish(),
  air_date: z.string().nullish(),
  poster_path: z.string().nullish(),
  episodes: listOf(
    z.object({
      episode_number: z.number(),
      name: z.string().nullish(),
      overview: z.string().nullish(),
      air_date: z.string().nullish(),
      runtime: z.number().nullish(),
      still_path: z.string().nullish(),
      vote_average: z.number().nullish(),
      vote_count: z.number().nullish(),
    }),
  ),
});

export type SeasonDto = z.infer<typeof seasonDtoSchema>;

export const episodeDtoSchema = z.object({
  season_number: z.number(),
  episode_number: z.number(),
  name: z.string().nullish(),
  overview: z.string().nullish(),
  air_date: z.string().nullish(),
  runtime: z.number().nullish(),
  still_path: z.string().nullish(),
  vote_average: z.number().nullish(),
  vote_count: z.number().nullish(),
  crew: listOf(crewDtoSchema),
  guest_stars: listOf(castDtoSchema),
  images: z.object({ stills: listOf(imageDtoSchema) }).nullish(),
});

export type EpisodeDto = z.infer<typeof episodeDtoSchema>;

export const collectionDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string().nullish(),
  poster_path: z.string().nullish(),
  backdrop_path: z.string().nullish(),
  parts: z.array(mediaItemDtoSchema),
});

export type CollectionDto = z.infer<typeof collectionDtoSchema>;
