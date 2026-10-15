import type { ImageSet } from '@shared/domain/model/imageSet';

export type PersonSummary = {
  readonly id: number;
  readonly name: string;
  /** Acting, Directing, Writing... as TMDB reports it; null when unknown. */
  readonly department: string | null;
  readonly profile: ImageSet | null;
  /** Titles the person is best known for, most popular first. */
  readonly knownFor: readonly string[];
};
