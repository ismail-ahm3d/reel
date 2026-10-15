import type { ImageSet } from '@shared/domain/model/imageSet';
import type { MediaSummary } from '@shared/domain/model/media';
import type { PersonSummary } from '@shared/domain/model/person';

/** What the search covers: everything (titles and people), or one kind. */
export type SearchScope = 'all' | 'movie' | 'tv' | 'person' | 'collection' | 'company' | 'keyword';

export const searchScopes: readonly SearchScope[] = [
  'all',
  'movie',
  'tv',
  'person',
  'collection',
  'company',
  'keyword',
];

/** A named thing that is not a title: a film series, a studio or a keyword. */
export type NamedResult = {
  readonly id: number;
  readonly name: string;
  readonly image: ImageSet | null;
};

export type SearchResult =
  | { readonly kind: 'media'; readonly media: MediaSummary }
  | { readonly kind: 'person'; readonly person: PersonSummary }
  | { readonly kind: 'collection' | 'company' | 'keyword'; readonly item: NamedResult };

export const searchResultKey = (result: SearchResult): string => {
  switch (result.kind) {
    case 'media':
      return `${result.media.ref.type}:${result.media.ref.id}`;
    case 'person':
      return `person:${result.person.id}`;
    default:
      return `${result.kind}:${result.item.id}`;
  }
};
