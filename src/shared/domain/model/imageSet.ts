/** One artwork at three resolutions; a view picks the smallest that fills its slot. */
export type ImageSet = {
  readonly small: string;
  readonly medium: string;
  readonly large: string;
};

/** An image with its shape, for galleries that lay out mixed sizes. */
export type SizedImage = {
  readonly image: ImageSet;
  /** Width over height. */
  readonly aspectRatio: number;
};
