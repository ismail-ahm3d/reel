import { z } from 'zod';

const imageSetRecordSchema = z.object({ small: z.string(), medium: z.string(), large: z.string() });

/** How one saved title is kept on the device. Version the key when this shape changes. */
export const watchlistRecordSchema = z.object({
  type: z.enum(['movie', 'tv']),
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  year: z.number().nullable(),
  rating: z.number().nullable(),
  voteCount: z.number(),
  poster: imageSetRecordSchema.nullable(),
  backdrop: imageSetRecordSchema.nullable(),
  genreIds: z.array(z.number()),
  addedAt: z.string(),
});

export const watchlistRecordsSchema = z.array(watchlistRecordSchema);

export type WatchlistRecord = z.infer<typeof watchlistRecordSchema>;
