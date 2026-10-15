/** Whose pictures a gallery shows. */
export type GallerySource =
  | { readonly kind: 'movie' | 'tv' | 'person'; readonly id: number }
  | { readonly kind: 'episode'; readonly id: number; readonly season: number; readonly episode: number };

/** Which pictures: TMDB files a title's art as backdrops and posters, a person's as profiles, an episode's as stills. */
export type GalleryKind = 'backdrops' | 'posters' | 'profiles' | 'stills';
