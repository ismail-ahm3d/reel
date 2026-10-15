import type { ImageSet } from '@shared/domain/model/imageSet';

/** A streaming service available in the user's region. */
export type StreamingService = {
  readonly id: number;
  readonly name: string;
  readonly logo: ImageSet | null;
};
