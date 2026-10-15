/** What a browse list is narrowed to when the user arrives from a tag, a studio or a network. */
export type BrowseSourceKind = 'genre' | 'keyword' | 'company' | 'network';

export type BrowseSource = {
  readonly kind: BrowseSourceKind;
  readonly id: number;
  readonly name: string;
};

export const isBrowseSourceKind = (value: string): value is BrowseSourceKind =>
  value === 'genre' || value === 'keyword' || value === 'company' || value === 'network';
