import type { ImageSet } from '@shared/domain/model/imageSet';
import type { MediaSummary, Page } from '@shared/domain/model/media';

export type Account = {
  readonly id: number;
  readonly username: string;
  /** The display name, when the user set one. */
  readonly name: string | null;
  readonly avatar: string | null;
};

/** What the signed-in user has done with one title. */
export type AccountStates = {
  readonly favorite: boolean;
  readonly watchlist: boolean;
  /** The user's score out of 10, in half steps; null when unrated. */
  readonly rating: number | null;
};

export type RatedTitle = {
  readonly media: MediaSummary;
  readonly rating: number;
};

export type UserList = {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly itemCount: number;
  readonly isPublic: boolean;
  readonly backdrop: ImageSet | null;
};

export type ListPage = {
  readonly list: UserList;
  readonly items: Page<MediaSummary>;
};

/** TMDB accepts scores from 0.5 to 10 in steps of 0.5. */
export const isValidRating = (value: number): boolean =>
  value >= 0.5 && value <= 10 && Number.isInteger(value * 2);

/** A list name TMDB accepts: something besides spaces, at most 100 characters. */
export const isValidListName = (name: string): boolean => name.trim().length > 0 && name.trim().length <= 100;
