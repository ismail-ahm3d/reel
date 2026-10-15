import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { confirmDestructive } from '@shared/core/presentation/feedback/confirm';
import { successFeedback } from '@shared/core/presentation/feedback/haptics';
import { shareLink } from '@shared/core/presentation/feedback/share';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { nextPageOf, sameMedia, type MediaRef, type MediaSummary } from '@shared/domain/model/media';
import type { WatchlistUseCases } from '@shared/domain/usecases/sharedUseCases';
import { useMediaSelection, type MediaSelection } from '@shared/presentation/hooks/useMediaSelection';
import type { UserList } from '@features/account/domain/model/account';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { useBulkActions, type BulkActions } from '@features/account/presentation/hooks/useBulkActions';
import { accountKeys } from '@features/account/presentation/queryKeys';

export type ListScreenProps = {
  readonly listId: number;
  readonly useCases: AccountUseCases;
  readonly watchlist: WatchlistUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
  /** Asks the user to confirm before anything is deleted; resolves true to go ahead. */
  readonly onConfirmDelete: (listName: string) => Promise<boolean>;
  readonly onDeleted: () => void;
};

export type ListView = {
  readonly list: UserList | null;
  readonly items: readonly MediaSummary[];
  readonly selection: MediaSelection;
  readonly bulk: BulkActions;
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly isDeleting: boolean;
  readonly isRemoving: boolean;
  readonly error: AppError | null;
  readonly actionError: AppError | null;
  readonly retry: () => void;
  readonly loadMore: () => void;
  /** A tap in the grid: opens the title, or picks it while selecting. */
  readonly openMedia: (media: MediaSummary) => void;
  readonly startSelecting: (media?: MediaSummary) => void;
  /** Asks first, then takes the picked titles out of the list. */
  readonly removeSelected: () => void;
  readonly deleteList: () => void;
  readonly share: () => void;
  readonly dismissActionError: () => void;
};

export const useListScreen = ({
  listId,
  useCases,
  watchlist,
  onOpenMedia,
  onConfirmDelete,
  onDeleted,
}: ListScreenProps): ListView => {
  const t = useTranslate();
  const queryClient = useQueryClient();
  const selection = useMediaSelection();
  const bulk = useBulkActions({ account: useCases, watchlist, selection, excludeListId: listId });
  const [actionError, setActionError] = useState<AppError | null>(null);
  const [removed, setRemoved] = useState<readonly MediaRef[]>([]);

  const pages = useInfiniteQuery({
    queryKey: accountKeys.list(listId),
    queryFn: async ({ pageParam }) => getOrThrow(await useCases.getList(listId, pageParam)),
    initialPageParam: 1,
    getNextPageParam: (page) => nextPageOf(page.items),
  });

  const remove = useMutation({
    mutationFn: async (refs: readonly MediaRef[]) => getOrThrow(await useCases.removeFromList(listId, refs)),
    // Optimistic: the titles leave at once and come back if TMDB refuses.
    onMutate: (refs) => {
      setActionError(null);
      setRemoved([...removed, ...refs]);
      selection.end();
    },
    onSuccess: successFeedback,
    onError: (error, refs) => {
      setRemoved(removed.filter((item) => !refs.some((ref) => sameMedia(item, ref))));
      setActionError(error);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists });
    },
  });

  const destroy = useMutation({
    mutationFn: async () => getOrThrow(await useCases.deleteList(listId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists });
      onDeleted();
    },
    onError: setActionError,
  });

  const list = pages.data?.pages[0]?.list ?? null;
  const items = (pages.data?.pages ?? [])
    .flatMap((page) => page.items.items)
    .filter((media) => !removed.some((ref) => sameMedia(ref, media.ref)));

  return {
    list: list === null ? null : { ...list, itemCount: Math.max(list.itemCount - removed.length, 0) },
    items,
    selection,
    bulk,
    isLoading: pages.isPending,
    isLoadingMore: pages.isFetchingNextPage,
    isDeleting: destroy.isPending,
    isRemoving: remove.isPending,
    error: pages.data === undefined ? pages.error : null,
    actionError: actionError ?? bulk.error,
    retry: () => void pages.refetch(),
    loadMore: () => {
      if (pages.hasNextPage && !pages.isFetchingNextPage) void pages.fetchNextPage();
    },
    openMedia: (media) => {
      if (selection.isSelecting) selection.toggle(media);
      else onOpenMedia(media.ref);
    },
    startSelecting: (media) => {
      if (items.length > 0) selection.start(media);
    },
    removeSelected: () => {
      const refs = selection.selected.map((media) => media.ref);
      if (refs.length === 0 || list === null) return;
      void confirmDestructive({
        title: t({ key: 'account.removeFromListTitle', params: { count: refs.length, name: list.name } }),
        message: t({ key: 'account.removeMessage' }),
        confirmLabel: t({ key: 'common.remove' }),
        cancelLabel: t({ key: 'common.cancel' }),
      }).then((confirmed) => {
        if (confirmed) remove.mutate(refs);
      });
    },
    deleteList: () => {
      if (list === null) return;
      void onConfirmDelete(list.name).then((confirmed) => {
        if (confirmed) destroy.mutate();
      });
    },
    share: () => {
      if (list !== null) shareLink(list.name, `https://www.themoviedb.org/list/${list.id}`);
    },
    dismissActionError: () => {
      setActionError(null);
      bulk.dismissError();
    },
  };
};
