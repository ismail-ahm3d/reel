import { z } from 'zod';
import type { HttpClient } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import {
  mediaItemDtoSchema,
  pageDtoSchema,
  personItemDtoSchema,
  type MediaItemDto,
  type PageDto,
  type PersonItemDto,
} from '@shared/data/datasources/remote/tmdbDto';
import type { SearchScope } from '@features/search/domain/model/searchResult';

/** One search hit as the server sent it. Multi search mixes people with titles. */
export type SearchHitDto =
  | { readonly kind: 'person'; readonly dto: PersonItemDto }
  | { readonly kind: 'media'; readonly type: 'movie' | 'tv'; readonly dto: MediaItemDto }
  | { readonly kind: 'collection' | 'company' | 'keyword'; readonly dto: NamedDto };

/** Collections carry a poster, companies a logo, keywords nothing but a name. */
export const namedDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  poster_path: z.string().nullish(),
  backdrop_path: z.string().nullish(),
  logo_path: z.string().nullish(),
});

export type NamedDto = z.infer<typeof namedDtoSchema>;

/** Every function may throw AppError; nothing else. */
export type SearchRemoteDataSource = {
  readonly search: (query: string, scope: SearchScope, page: number) => Promise<PageDto<SearchHitDto>>;
  readonly trending: () => Promise<PageDto<MediaItemDto>>;
  readonly popularPeople: () => Promise<PageDto<PersonItemDto>>;
};

const rawPageSchema = pageDtoSchema(z.object({ media_type: z.string().nullish() }).loose());
const mediaPageSchema = pageDtoSchema(mediaItemDtoSchema);
const personPageSchema = pageDtoSchema(personItemDtoSchema);

const toHit = (raw: unknown, scope: SearchScope): SearchHitDto | null => {
  if (scope === 'collection' || scope === 'company' || scope === 'keyword')
    return { kind: scope, dto: namedDtoSchema.parse(raw) };
  const mediaType =
    scope === 'all' ? z.object({ media_type: z.string().nullish() }).parse(raw).media_type : scope;
  if (mediaType === 'person') return { kind: 'person', dto: personItemDtoSchema.parse(raw) };
  if (mediaType === 'movie' || mediaType === 'tv')
    return { kind: 'media', type: mediaType, dto: mediaItemDtoSchema.parse(raw) };
  return null; // a kind TMDB may add later: skipped, not a contract break
};

const paths: Readonly<Record<SearchScope, string>> = {
  all: 'search/multi',
  movie: 'search/movie',
  tv: 'search/tv',
  person: 'search/person',
  collection: 'search/collection',
  company: 'search/company',
  keyword: 'search/keyword',
};

export const makeSearchRemoteDataSource = ({ http }: { http: HttpClient }): SearchRemoteDataSource => ({
  search: (query, scope, page) =>
    remoteOutcome(async () => {
      const raw = rawPageSchema.parse(await http.get(paths[scope], { query, page, include_adult: false }));
      return {
        ...raw,
        results: raw.results
          .map((item) => toHit(item, scope))
          .filter((hit): hit is SearchHitDto => hit !== null),
      };
    }),
  trending: () => remoteOutcome(async () => mediaPageSchema.parse(await http.get('trending/all/day'))),
  popularPeople: () => remoteOutcome(async () => personPageSchema.parse(await http.get('person/popular'))),
});
