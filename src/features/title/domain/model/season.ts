import type { ImageSet } from '@shared/domain/model/imageSet';

export type Episode = {
  readonly number: number;
  readonly name: string;
  readonly overview: string;
  readonly airDate: string | null;
  readonly runtimeMinutes: number | null;
  readonly still: ImageSet | null;
  readonly rating: number | null;
};

export type SeasonDetails = {
  readonly showId: number;
  readonly number: number;
  readonly name: string;
  readonly overview: string;
  readonly airDate: string | null;
  readonly poster: ImageSet | null;
  readonly episodes: readonly Episode[];
};
