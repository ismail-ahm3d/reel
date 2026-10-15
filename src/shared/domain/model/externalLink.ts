export type ExternalLinkKind =
  'imdb' | 'wikidata' | 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'homepage';

/** A page about a title or a person on another site. */
export type ExternalLink = {
  readonly kind: ExternalLinkKind;
  readonly url: string;
};
