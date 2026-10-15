import { useInfiniteQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { nextPageOf, type MediaRef, type MediaSummary, type MediaType } from '@shared/domain/model/media';
import type { Category } from '@features/discover/domain/model/category';
import type { DiscoverUseCases } from '@features/discover/domain/usecases/discoverUseCases';
import { discoverKeys } from '@features/discover/presentation/queryKeys';

export type CategoryScreenProps = {
  readonly type: MediaType;
  readonly category: Category;
  readonly useCases: DiscoverUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
};

export type CategoryView = {
  readonly items: readonly MediaSummary[];
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly loadMore: () => void;
  readonly openMedia: (media: MediaSummary) => void;
};

export const useCategoryScreen = ({
  type,
  category,
  useCases,
  onOpenMedia,
}: CategoryScreenProps): CategoryView => {
  const pages = useInfiniteQuery({
    queryKey: discoverKeys.category(type, category),
    queryFn: async ({ pageParam }) => getOrThrow(await useCases.getCategoryPage(type, category, pageParam)),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
  });

  // TMDB pages overlap when rankings shift between requests; keep the first occurrence.
  const seen = new Set<number>();
  const items = (pages.data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((media) => !seen.has(media.ref.id) && seen.add(media.ref.id));

  return {
    items,
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
  };
};
