import { z } from 'zod';
import {
  externalIdsDtoSchema,
  imageDtoSchema,
  mediaItemDtoSchema,
} from '@shared/data/datasources/remote/tmdbDto';

const creditDtoSchema = mediaItemDtoSchema.extend({
  character: z.string().nullish(),
  job: z.string().nullish(),
  department: z.string().nullish(),
  episode_count: z.number().nullish(),
  popularity: z.number().nullish(),
});

export const personDetailsDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  biography: z.string().nullish(),
  known_for_department: z.string().nullish(),
  birthday: z.string().nullish(),
  deathday: z.string().nullish(),
  place_of_birth: z.string().nullish(),
  profile_path: z.string().nullish(),
  homepage: z.string().nullish(),
  also_known_as: z.array(z.string()).nullish(),
  external_ids: externalIdsDtoSchema.nullish(),
  images: z.object({ profiles: z.array(imageDtoSchema).nullish() }).nullish(),
  combined_credits: z.object({ cast: z.array(creditDtoSchema), crew: z.array(creditDtoSchema) }).nullish(),
});

export type PersonDetailsDto = z.infer<typeof personDetailsDtoSchema>;
export type CreditDto = z.infer<typeof creditDtoSchema>;
