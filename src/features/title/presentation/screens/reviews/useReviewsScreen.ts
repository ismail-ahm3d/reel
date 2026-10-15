import { useInfiniteQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { nextPageOf, type MediaRef } from '@shared/domain/model/media';
import type { Review } from '@features/title/domain/model/titleDetails';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import { titleKeys } from '@features/title/presentation/queryKeys';

export type ReviewsScreenProps = {
  readonly mediaRef: MediaRef;
  readonly useCases: TitleUseCases;
  readonly onOpenLink: (url: string) => void;
};

export type ReviewsView = {
  readonly reviews: readonly Review[];
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly loadMore: () => void;
  readonly openReview: (review: Review) => void;
};

export const useReviewsScreen = ({ mediaRef, useCases, onOpenLink }: ReviewsScreenProps): ReviewsView => {
  const pages = useInfiniteQuery({
    queryKey: titleKeys.reviews(mediaRef),
    queryFn: async ({ pageParam }) => getOrThrow(await useCases.getReviews(mediaRef, pageParam)),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
  });
  return {
    reviews: (pages.data?.pages ?? []).flatMap((page) => page.items),
    isLoading: pages.isPending,
    isLoadingMore: pages.isFetchingNextPage,
    error: pages.data === undefined ? pages.error : null,
    retry: () => void pages.refetch(),
    loadMore: () => {
      if (pages.hasNextPage && !pages.isFetchingNextPage) void pages.fetchNextPage();
    },
    openReview: (review) => {
      onOpenLink(review.url);
    },
  };
};
