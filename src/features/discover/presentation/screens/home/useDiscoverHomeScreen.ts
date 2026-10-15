import { useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback } from '@shared/core/presentation/feedback/haptics';
import type { Genre } from '@shared/domain/model/genre';
import type { MediaRef, MediaSummary, MediaType } from '@shared/domain/model/media';
import type { GenreUseCases } from '@shared/domain/usecases/sharedUseCases';
import { genreKeys } from '@shared/presentation/query/sharedKeys';
import { categoriesOf, type Category, type TrendingPeriod } from '@features/discover/domain/model/category';
import type { DiscoverUseCases } from '@features/discover/domain/usecases/discoverUseCases';
import { discoverKeys } from '@features/discover/presentation/queryKeys';

export type DiscoverHomeScreenProps = {
  readonly type: MediaType;
  readonly useCases: DiscoverUseCases;
  readonly genres: GenreUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
  readonly onOpenCategory: (type: MediaType, category: Category) => void;
  readonly onBrowse: (type: MediaType, genre: Genre | null) => void;
  /** The user's setting, already off while the screen is out of sight. */
  readonly autoplayFeatured: boolean;
};

export type HomeRail = {
  readonly category: Category;
  readonly items: readonly MediaSummary[];
};

export type DiscoverHomeView = {
  readonly type: MediaType;
  readonly featured: readonly MediaSummary[];
  readonly autoplayFeatured: boolean;
  readonly rails: readonly HomeRail[];
  readonly genres: readonly Genre[];
  readonly trendingPeriod: TrendingPeriod;
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly isRefreshing: boolean;
  readonly retry: () => void;
  readonly refresh: () => void;
  readonly openMedia: (media: MediaSummary) => void;
  readonly openCategory: (category: Category) => void;
  readonly browseGenre: (genre: Genre) => void;
  readonly browseAll: () => void;
  readonly setTrendingPeriod: (period: TrendingPeriod) => void;
};

/** How many trending titles the carousel shows; the rest form the trending rail. */
const featuredCount = 6;

export const useDiscoverHomeScreen = ({
  type,
  useCases,
  genres,
  onOpenMedia,
  onOpenCategory,
  onBrowse,
  autoplayFeatured,
}: DiscoverHomeScreenProps): DiscoverHomeView => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [trendingPeriod, setTrendingPeriod] = useState<TrendingPeriod>('week');
  const categories = categoriesOf(type);

  const lists = useQueries({
    queries: categories.map((category) => ({
      queryKey: discoverKeys.preview(type, category),
      queryFn: async () => getOrThrow(await useCases.getCategoryPage(type, category, 1)),
    })),
  });

  const genreList = useQuery({
    queryKey: genreKeys.list(type),
    queryFn: async () => getOrThrow(await genres.getGenres(type)),
    staleTime: Infinity, // genre lists change with TMDB releases, not during a session
  });

  // The carousel always shows today's trends; the trending rail shows the chosen period.
  const today = useQuery({
    queryKey: discoverKeys.preview(type, 'trendingToday'),
    queryFn: async () => getOrThrow(await useCases.getCategoryPage(type, 'trendingToday', 1)),
  });

  const trending = lists[categories.indexOf('trending')];
  const todayItems = today.data?.items ?? [];
  const featured = todayItems.filter((media) => media.backdrop !== null).slice(0, featuredCount);
  const featuredIds = new Set(featured.map((media) => media.ref.id));

  const rails: HomeRail[] = categories.map((category, index) => ({
    category: category === 'trending' && trendingPeriod === 'day' ? 'trendingToday' : category,
    items:
      category === 'trending'
        ? trendingPeriod === 'day'
          ? todayItems.filter((media) => !featuredIds.has(media.ref.id))
          : (trending?.data?.items ?? [])
        : (lists[index]?.data?.items ?? []),
  }));

  const refetchAll = () =>
    Promise.all([...lists.map((list) => list.refetch()), today.refetch(), genreList.refetch()]);

  return {
    type,
    featured,
    autoplayFeatured,
    rails,
    genres: genreList.data ?? [],
    trendingPeriod,
    isLoading: lists.every((list) => list.isPending),
    // The page fails only when nothing at all could load; a single missing rail just hides.
    error: lists.every((list) => list.error !== null) ? (trending?.error ?? null) : null,
    isRefreshing,
    retry: () => {
      void refetchAll();
    },
    refresh: () => {
      setRefreshing(true);
      void refetchAll().finally(() => {
        setRefreshing(false);
      });
    },
    openMedia: (media) => {
      onOpenMedia(media.ref);
    },
    openCategory: (category) => {
      onOpenCategory(type, category);
    },
    browseGenre: (genre) => {
      onBrowse(type, genre);
    },
    browseAll: () => {
      onBrowse(type, null);
    },
    setTrendingPeriod: (period) => {
      selectionFeedback();
      setTrendingPeriod(period);
    },
  };
};
