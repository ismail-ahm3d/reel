import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback, successFeedback } from '@shared/core/presentation/feedback/haptics';
import { sameMedia, type MediaRef, type MediaSummary } from '@shared/domain/model/media';
import type { WatchlistUseCases } from '@shared/domain/usecases/sharedUseCases';
import { watchlistKeys } from '@shared/presentation/query/sharedKeys';
import type { Collection } from '@features/title/domain/model/collection';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import { titleKeys } from '@features/title/presentation/queryKeys';

export type CollectionScreenProps = {
  readonly collectionId: number;
  readonly useCases: TitleUseCases;
  readonly watchlist: WatchlistUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
};

export type CollectionView = {
  readonly collection: Collection | null;
  /** The mean score of the rated parts, one decimal. */
  readonly averageRating: number | null;
  readonly isLoading: boolean;
  readonly error: AppError | null;
  /** Every part is on the watchlist already. */
  readonly isAllSaved: boolean;
  readonly isSaving: boolean;
  readonly saveError: AppError | null;
  readonly retry: () => void;
  readonly openMedia: (media: MediaSummary) => void;
  /** Saves the parts that are missing, or removes them all when every one is saved. */
  readonly toggleAllSaved: () => void;
  readonly dismissSaveError: () => void;
};

export const useCollectionScreen = ({
  collectionId,
  useCases,
  watchlist,
  onOpenMedia,
}: CollectionScreenProps): CollectionView => {
  const queryClient = useQueryClient();
  const collection = useQuery({
    queryKey: titleKeys.collection(collectionId),
    queryFn: async () => getOrThrow(await useCases.getCollection(collectionId)),
  });
  const saved = useQuery({
    queryKey: watchlistKeys.all,
    queryFn: async () => getOrThrow(await watchlist.getWatchlist()),
  });
  const parts = collection.data?.parts ?? [];
  const missing = parts.filter(
    (part) => !(saved.data ?? []).some((entry) => sameMedia(entry.media.ref, part.ref)),
  );
  const isAllSaved = saved.data !== undefined && parts.length > 0 && missing.length === 0;

  const toggle = useMutation({
    mutationFn: async (save: boolean) =>
      getOrThrow(
        save
          ? await watchlist.addToWatchlist(missing)
          : await watchlist.removeFromWatchlist(parts.map((part) => part.ref)),
      ),
    onSuccess: (_, save) => {
      if (save) successFeedback();
      else selectionFeedback();
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
  const ratings = (collection.data?.parts ?? []).flatMap((part) =>
    part.rating === null ? [] : [part.rating],
  );
  return {
    collection: collection.data ?? null,
    averageRating:
      ratings.length === 0
        ? null
        : Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) / 10,
    isLoading: collection.isPending,
    error: collection.error,
    isAllSaved,
    isSaving: toggle.isPending,
    saveError: toggle.error,
    retry: () => void collection.refetch(),
    openMedia: (media) => {
      onOpenMedia(media.ref);
    },
    toggleAllSaved: () => {
      if (!toggle.isPending && saved.data !== undefined) toggle.mutate(!isAllSaved);
    },
    dismissSaveError: () => {
      toggle.reset();
    },
  };
};
