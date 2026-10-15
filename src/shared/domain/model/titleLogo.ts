import type { ImageSet } from '@shared/domain/model/imageSet';

/** A title's typeset logo ("title card"), transparent, to lay over artwork. */
export type TitleLogo = {
  readonly image: ImageSet;
  /** Width over height; logos range from square marks to long wordmarks. */
  readonly aspectRatio: number;
};
