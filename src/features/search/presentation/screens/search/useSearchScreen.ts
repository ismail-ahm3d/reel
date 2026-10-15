import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { useDebouncedValue } from '@shared/core/presentation/hooks/useDebouncedValue';
import { selectionFeedback } from '@shared/core/presentation/feedback/haptics';
import type { BrowseSource } from '@shared/domain/model/browseSource';
import type { Genre } from '@shared/domain/model/genre';
import { nextPageOf, type MediaRef, type MediaSummary, type MediaType } from '@shared/domain/model/media';
import type { PersonSummary } from '@shared/domain/model/person';
import type { GenreUseCases } from '@shared/domain/usecases/sharedUseCases';
import { genreKeys } from '@shared/presentation/query/sharedKeys';
import {
  searchResultKey,
  type SearchResult,
  type SearchScope,
} from '@features/search/domain/model/searchResult';
import type { SearchUseCases } from '@features/search/domain/usecases/searchUseCases';
import { searchKeys } from '@features/search/presentation/queryKeys';

export type SearchScreenProps = {
  /** What the user typed in the header's search field. */
  readonly query: string;
  readonly useCases: SearchUseCases;
  readonly genres: GenreUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
  readonly onOpenPerson: (id: number) => void;
  readonly onBrowse: (type: MediaType, genre: Genre | null) => void;
  readonly onOpenCollection: (id: number) => void;
  /** A company or keyword result: every title it covers. */
  readonly onBrowseSource: (source: BrowseSource) => void;
};

export type SearchView = {
  /** idle shows suggestions; results shows what the query found. */
  readonly mode: 'idle' | 'results';
  readonly scope: SearchScope;
  readonly results: readonly SearchResult[];
  readonly isSearching: boolean;
  readonly isLoadingMore: boolean;
  readonly searchError: AppError | null;
  readonly trending: readonly MediaSummary[];
  readonly people: readonly PersonSummary[];
  readonly movieGenres: readonly Genre[];
  readonly tvGenres: readonly Genre[];
  readonly setScope: (scope: SearchScope) => void;
  readonly loadMore: () => void;
  readonly retrySearch: () => void;
  readonly openMedia: (media: MediaSummary) => void;
  readonly openPerson: (person: PersonSummary) => void;
  readonly browse: (type: MediaType, genre: Genre | null) => void;
  readonly openNamed: (result: SearchResult) => void;
};

const debounceMs = 300;

export const useSearchScreen = ({
  query,
  useCases,
  genres,
  onOpenMedia,
  onOpenPerson,
  onBrowse,
  onOpenCollection,
  onBrowseSource,
}: SearchScreenProps): SearchView => {
  const [scope, setScope] = useState<SearchScope>('all');
  const settled = useDebouncedValue(query.trim(), debounceMs);
  const isActive = settled !== '';

  const results = useInfiniteQuery({
    queryKey: searchKeys.results(settled, scope),
    queryFn: async ({ pageParam }) => getOrThrow(await useCases.searchCatalog(settled, scope, pageParam)),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: isActive,
    placeholderData: (previous) => previous, // typing refines the list instead of blanking it
  });

  const trending = useQuery({
    queryKey: searchKeys.trending,
    queryFn: async () => getOrThrow(await useCases.getTrendingNow()),
  });
  const people = useQuery({
    queryKey: searchKeys.people,
    queryFn: async () => getOrThrow(await useCases.getPopularPeople()),
  });
  const movieGenres = useQuery({
    queryKey: genreKeys.list('movie'),
    queryFn: async () => getOrThrow(await genres.getGenres('movie')),
    staleTime: Infinity,
  });
  const tvGenres = useQuery({
    queryKey: genreKeys.list('tv'),
    queryFn: async () => getOrThrow(await genres.getGenres('tv')),
    staleTime: Infinity,
  });

  const seen = new Set<string>();
  const items = (results.data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((result) => {
      const key = searchResultKey(result);
      return !seen.has(key) && seen.add(key);
    });

  return {
    mode: query.trim() === '' ? 'idle' : 'results',
    scope,
    results: isActive ? items : [],
    isSearching: isActive && (results.isPending || (results.isPlaceholderData && results.isFetching)),
    isLoadingMore: results.isFetchingNextPage,
    searchError: results.data === undefined ? results.error : null,
    trending: trending.data ?? [],
    people: people.data ?? [],
    movieGenres: movieGenres.data ?? [],
    tvGenres: tvGenres.data ?? [],
    setScope: (next) => {
      selectionFeedback();
      setScope(next);
    },
    loadMore: () => {
      if (results.hasNextPage && !results.isFetchingNextPage) void results.fetchNextPage();
    },
    retrySearch: () => void results.refetch(),
    openMedia: (media) => {
      onOpenMedia(media.ref);
    },
    openPerson: (person) => {
      onOpenPerson(person.id);
    },
    browse: onBrowse,
    openNamed: (result) => {
      if (result.kind === 'collection') onOpenCollection(result.item.id);
      if (result.kind === 'company' || result.kind === 'keyword')
        onBrowseSource({ kind: result.kind, id: result.item.id, name: result.item.name });
    },
  };
};
