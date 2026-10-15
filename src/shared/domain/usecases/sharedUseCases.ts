import type { AddToWatchlist } from '@shared/domain/usecases/addToWatchlist';
import type { GetGenres } from '@shared/domain/usecases/getGenres';
import type { GetWatchlist } from '@shared/domain/usecases/getWatchlist';
import type { RemoveFromWatchlist } from '@shared/domain/usecases/removeFromWatchlist';
import type { ToggleWatchlist } from '@shared/domain/usecases/toggleWatchlist';

export type WatchlistUseCases = {
  readonly getWatchlist: GetWatchlist;
  readonly toggleWatchlist: ToggleWatchlist;
  readonly addToWatchlist: AddToWatchlist;
  readonly removeFromWatchlist: RemoveFromWatchlist;
};

export type GenreUseCases = {
  readonly getGenres: GetGenres;
};
