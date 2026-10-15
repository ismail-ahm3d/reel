import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback } from '@shared/core/presentation/feedback/haptics';
import type { BrowseSource } from '@shared/domain/model/browseSource';
import type { Genre } from '@shared/domain/model/genre';
import { nextPageOf, type MediaRef, type MediaSummary, type MediaType } from '@shared/domain/model/media';
import type { GenreUseCases } from '@shared/domain/usecases/sharedUseCases';
import { genreKeys } from '@shared/presentation/query/sharedKeys';
import {
  activeFilterCount,
  filtersFrom,
  resetFilters,
  sortOrdersFor,
  toggleGenre,
  toggleProvider,
  type BrowseFilters,
  type RuntimeRange,
  type SortOrder,
} from '@features/discover/domain/model/browseFilters';
import type { StreamingService } from '@features/discover/domain/model/watchProvider';
import type { DiscoverUseCases } from '@features/discover/domain/usecases/discoverUseCases';
import { discoverKeys } from '@features/discover/presentation/queryKeys';

export type BrowseScreenProps = {
  readonly type: MediaType;
  /** Where the user came from: a genre is preselected, a keyword, studio or network narrows the list. */
  readonly source: BrowseSource | null;
  readonly useCases: DiscoverUseCases;
  readonly genres: GenreUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
};

export type BrowseView = {
  readonly type: MediaType;
  readonly items: readonly MediaSummary[];
  readonly totalResults: number | null;
  readonly filters: BrowseFilters;
  readonly sortOrders: readonly SortOrder[];
  readonly genres: readonly Genre[];
  readonly services: readonly StreamingService[];
  readonly activeFilterCount: number;
  readonly isFilterSheetOpen: boolean;
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly loadMore: () => void;
  readonly openMedia: (media: MediaSummary) => void;
  readonly openFilters: () => void;
  readonly closeFilters: () => void;
  readonly resetFilters: () => void;
  readonly setSort: (sort: SortOrder) => void;
  readonly toggleGenre: (genreId: number) => void;
  readonly toggleService: (serviceId: number) => void;
  readonly setDecade: (decade: number) => void;
  readonly setMinRating: (rating: number) => void;
  readonly setLanguage: (language: string) => void;
  readonly setRuntime: (runtime: RuntimeRange) => void;
};

export const useBrowseScreen = ({
  type,
  source,
  useCases,
  genres,
  onOpenMedia,
}: BrowseScreenProps): BrowseView => {
  const [filters, setFilters] = useState(() => filtersFrom(source));
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);

  const pages = useInfiniteQuery({
    queryKey: discoverKeys.browse(type, filters),
    queryFn: async ({ pageParam }) => getOrThrow(await useCases.browseTitles(type, filters, pageParam)),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    placeholderData: (previous) => previous, // keeps the grid on screen while a new filter loads
  });

  const genreList = useQuery({
    queryKey: genreKeys.list(type),
    queryFn: async () => getOrThrow(await genres.getGenres(type)),
    staleTime: Infinity,
  });

  const services = useQuery({
    queryKey: discoverKeys.services(type),
    queryFn: async () => getOrThrow(await useCases.getStreamingServices(type)),
    staleTime: Infinity,
    enabled: isFilterSheetOpen, // fetched the first time the sheet opens
  });

  const update = (next: BrowseFilters) => {
    selectionFeedback();
    setFilters(next);
  };

  /** Picking the current value again clears it, like the system's filter menus. */
  const choose = <K extends 'decade' | 'minRating' | 'language' | 'runtime'>(
    key: K,
    value: NonNullable<BrowseFilters[K]>,
  ) => {
    update({ ...filters, [key]: filters[key] === value ? null : value });
  };

  const seen = new Set<number>();
  const items = (pages.data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((media) => !seen.has(media.ref.id) && seen.add(media.ref.id));

  return {
    type,
    items,
    totalResults: pages.data?.pages[0]?.totalResults ?? null,
    filters,
    sortOrders: sortOrdersFor(type),
    genres: genreList.data ?? [],
    services: services.data ?? [],
    activeFilterCount: activeFilterCount(filters),
    isFilterSheetOpen,
    isLoading: pages.isPending,
    isLoadingMore: pages.isFetchingNextPage,
    error: pages.data === undefined ? pages.error : null,
    retry: () => void pages.refetch(),
    loadMore: () => {
      if (pages.hasNextPage && !pages.isFetchingNextPage) void pages.fetchNextPage();
    },
    openMedia: (media) => {
      onOpenMedia(media.ref);
    },
    openFilters: () => {
      setFilterSheetOpen(true);
    },
    closeFilters: () => {
      setFilterSheetOpen(false);
    },
    resetFilters: () => {
      update(resetFilters(filters));
    },
    setSort: (sort) => {
      update({ ...filters, sort });
    },
    toggleGenre: (genreId) => {
      update(toggleGenre(filters, genreId));
    },
    toggleService: (serviceId) => {
      update(toggleProvider(filters, serviceId));
    },
    setDecade: (decade) => {
      choose('decade', decade);
    },
    setMinRating: (rating) => {
      choose('minRating', rating);
    },
    setLanguage: (language) => {
      choose('language', language);
    },
    setRuntime: (runtime) => {
      choose('runtime', runtime);
    },
  };
};
