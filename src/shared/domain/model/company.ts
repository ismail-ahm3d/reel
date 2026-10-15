import type { ImageSet } from '@shared/domain/model/imageSet';

/** A studio, a production company or a TV network. */
export type Company = {
  readonly id: number;
  readonly name: string;
  readonly logo: ImageSet | null;
};
