import { z } from 'zod';

/** A movie or a show as every TMDB list returns it. Movies carry title/release_date, shows name/first_air_date. */
export const mediaItemDtoSchema = z.object({
  id: z.number(),
  media_type: z.string().nullish(),
  title: z.string().nullish(),
  name: z.string().nullish(),
  overview: z.string().nullish(),
  release_date: z.string().nullish(),
  first_air_date: z.string().nullish(),
  vote_average: z.number().nullish(),
  vote_count: z.number().nullish(),
  poster_path: z.string().nullish(),
  backdrop_path: z.string().nullish(),
  genre_ids: z.array(z.number()).nullish(),
});

export type MediaItemDto = z.infer<typeof mediaItemDtoSchema>;

export const personItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  known_for_department: z.string().nullish(),
  profile_path: z.string().nullish(),
  known_for: z.array(mediaItemDtoSchema).nullish(),
});

export type PersonItemDto = z.infer<typeof personItemDtoSchema>;

export const pageDtoSchema = <Item extends z.ZodType>(item: Item) =>
  z.object({
    page: z.number(),
    results: z.array(item),
    total_pages: z.number(),
    total_results: z.number(),
  });

export type PageDto<Item> = {
  readonly page: number;
  readonly results: readonly Item[];
  readonly total_pages: number;
  readonly total_results: number;
};

export const genreDtoSchema = z.object({ id: z.number(), name: z.string() });

export const genreListDtoSchema = z.object({ genres: z.array(genreDtoSchema) });

export type GenreListDto = z.infer<typeof genreListDtoSchema>;

/** The external_ids append of a title or a person. */
export const externalIdsDtoSchema = z.object({
  imdb_id: z.string().nullish(),
  wikidata_id: z.string().nullish(),
  facebook_id: z.string().nullish(),
  instagram_id: z.string().nullish(),
  twitter_id: z.string().nullish(),
  tiktok_id: z.string().nullish(),
  youtube_id: z.string().nullish(),
});

export type ExternalIdsDto = z.infer<typeof externalIdsDtoSchema>;

export const imageDtoSchema = z.object({
  file_path: z.string(),
  aspect_ratio: z.number(),
  iso_639_1: z.string().nullish(),
  vote_average: z.number().nullish(),
});

export type ImageDto = z.infer<typeof imageDtoSchema>;

export const companyDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_path: z.string().nullish(),
});

export type CompanyDto = z.infer<typeof companyDtoSchema>;
