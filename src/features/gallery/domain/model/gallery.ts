import type { GalleryKind } from '@shared/domain/model/gallerySource';
import type { SizedImage } from '@shared/domain/model/imageSet';

/** Every picture of one subject, by kind; kinds the subject does not have are empty. */
export type Gallery = Readonly<Record<GalleryKind, readonly SizedImage[]>>;

export const galleryKinds: readonly GalleryKind[] = ['backdrops', 'posters', 'stills', 'profiles'];

/** The kinds that have at least one picture, in display order. */
export const availableKinds = (gallery: Gallery): readonly GalleryKind[] =>
  galleryKinds.filter((kind) => gallery[kind].length > 0);
