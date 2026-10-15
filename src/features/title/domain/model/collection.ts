import type { ImageSet } from '@shared/domain/model/imageSet';
import type { MediaSummary } from '@shared/domain/model/media';

/** A film series such as "The Lord of the Rings Collection". */
export type Collection = {
  readonly id: number;
  readonly name: string;
  readonly overview: string;
  readonly poster: ImageSet | null;
  readonly backdrop: ImageSet | null;
  /** Release order; announced films without a date go last. */
  readonly parts: readonly MediaSummary[];
};

export const sortParts = (parts: readonly MediaSummary[]): readonly MediaSummary[] =>
  [...parts].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
