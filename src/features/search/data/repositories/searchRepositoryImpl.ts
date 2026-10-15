import {
  isTitleDto,
  toImageSet,
  toMediaSummary,
  toPage,
  toPersonSummary,
} from '@shared/data/mappers/tmdbMappers';
import type { SearchResult } from '@features/search/domain/model/searchResult';
import type { SearchRepository } from '@features/search/domain/repositories/searchRepository';
import type {
  SearchHitDto,
  SearchRemoteDataSource,
} from '@features/search/data/datasources/remote/searchRemoteDataSource';

const toSearchResult = (hit: SearchHitDto): SearchResult => {
  switch (hit.kind) {
    case 'person':
      return { kind: 'person', person: toPersonSummary(hit.dto) };
    case 'media':
      return { kind: 'media', media: toMediaSummary(hit.dto, hit.type) };
    default:
      return {
        kind: hit.kind,
        item: {
          id: hit.dto.id,
          name: hit.dto.name,
          image:
            hit.kind === 'company'
              ? toImageSet(hit.dto.logo_path, 'logo')
              : toImageSet(
                  hit.dto.backdrop_path ?? hit.dto.poster_path,
                  hit.dto.backdrop_path ? 'backdrop' : 'poster',
                ),
        },
      };
  }
};

export const makeSearchRepository = ({ remote }: { remote: SearchRemoteDataSource }): SearchRepository => ({
  search: async (query, scope, page) => toPage(await remote.search(query, scope, page), toSearchResult),
  trending: async () =>
    (await remote.trending()).results.filter(isTitleDto).map((dto) => toMediaSummary(dto, 'movie')),
  popularPeople: async () => (await remote.popularPeople()).results.map(toPersonSummary),
});
