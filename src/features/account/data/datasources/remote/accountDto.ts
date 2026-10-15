import { z } from 'zod';
import { mediaItemDtoSchema, pageDtoSchema } from '@shared/data/datasources/remote/tmdbDto';

export const requestTokenDtoSchema = z.object({ request_token: z.string() });
export const accessTokenDtoSchema = z.object({ access_token: z.string(), account_id: z.string() });
export const sessionDtoSchema = z.object({ session_id: z.string() });

export const accountDtoSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().nullish(),
  avatar: z
    .object({
      tmdb: z.object({ avatar_path: z.string().nullish() }).nullish(),
      gravatar: z.object({ hash: z.string().nullish() }).nullish(),
    })
    .nullish(),
});

export type AccountDto = z.infer<typeof accountDtoSchema>;

/** `rated` is false when unrated, or an object with the score. */
export const accountStatesDtoSchema = z.object({
  favorite: z.boolean(),
  watchlist: z.boolean(),
  rated: z.union([z.boolean(), z.object({ value: z.number() })]),
});

export type AccountStatesDto = z.infer<typeof accountStatesDtoSchema>;

export const mediaPageDtoSchema = pageDtoSchema(mediaItemDtoSchema);

export const ratedItemDtoSchema = mediaItemDtoSchema.extend({ rating: z.number() });
export const ratedPageDtoSchema = pageDtoSchema(ratedItemDtoSchema);
export type RatedItemDto = z.infer<typeof ratedItemDtoSchema>;

/** v4 sends public as 1/0 on some endpoints and true/false on others. */
const publicFlag = z.union([z.boolean(), z.number()]).nullish();

export const listDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  number_of_items: z.number().nullish(),
  public: publicFlag,
  backdrop_path: z.string().nullish(),
});

export type ListDto = z.infer<typeof listDtoSchema>;

export const listPageDtoSchema = pageDtoSchema(listDtoSchema);

export const listDetailsDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  public: publicFlag,
  backdrop_path: z.string().nullish(),
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
  results: z.array(mediaItemDtoSchema),
});

export type ListDetailsDto = z.infer<typeof listDetailsDtoSchema>;

export const createdListDtoSchema = z.object({ id: z.number() });
