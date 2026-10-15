import type { WatchlistEntry } from '@shared/domain/model/watchlistEntry';
import type { WatchlistRecord } from '@shared/data/datasources/storage/watchlistRecord';

export const toWatchlistEntry = (record: WatchlistRecord): WatchlistEntry => ({
  media: {
    ref: { type: record.type, id: record.id },
    title: record.title,
    overview: record.overview,
    year: record.year,
    rating: record.rating,
    voteCount: record.voteCount,
    poster: record.poster,
    backdrop: record.backdrop,
    genreIds: record.genreIds,
  },
  addedAt: new Date(record.addedAt),
});

export const toWatchlistRecord = ({ media, addedAt }: WatchlistEntry): WatchlistRecord => ({
  type: media.ref.type,
  id: media.ref.id,
  title: media.title,
  overview: media.overview,
  year: media.year,
  rating: media.rating,
  voteCount: media.voteCount,
  poster: media.poster,
  backdrop: media.backdrop,
  genreIds: [...media.genreIds],
  addedAt: addedAt.toISOString(),
});
