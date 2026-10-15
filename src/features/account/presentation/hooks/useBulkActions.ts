import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { confirmDestructive } from '@shared/core/presentation/feedback/confirm';
import { successFeedback } from '@shared/core/presentation/feedback/haptics';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { sameMedia, type MediaRef, type MediaSummary } from '@shared/domain/model/media';
import type { WatchlistEntry } from '@shared/domain/model/watchlistEntry';
import type { WatchlistUseCases } from '@shared/domain/usecases/sharedUseCases';
import type { MediaSelection } from '@shared/presentation/hooks/useMediaSelection';
import { watchlistKeys } from '@shared/presentation/query/sharedKeys';
import type { UserList } from '@features/account/domain/model/account';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { accountKeys } from '@features/account/presentation/queryKeys';

export type ListPickerState = {
  readonly visible: boolean;
  readonly title: string;
  readonly lists: readonly UserList[];
  readonly isLoading: boolean;
  readonly addedTo: readonly number[];
  readonly pick: (list: UserList) => void;
  readonly close: () => void;
};

export type BulkActions = {
  readonly isWorking: boolean;
  readonly error: AppError | null;
  readonly dismissError: () => void;
  readonly addToWatchlist: () => void;
  /** Asks first; the titles leave the grid at once and come back if TMDB refuses. */
  readonly removeFromWatchlist: () => void;
  readonly openListPicker: () => void;
  readonly listPicker: ListPickerState;
};

/**
 * What can be done with several picked titles: save them, remove them from the watchlist, or add
 * them to one or more lists. Each finished action ends the selection.
 */
export const useBulkActions = ({
  account,
  watchlist,
  selection,
  excludeListId,
}: {
  readonly account: AccountUseCases;
  readonly watchlist: WatchlistUseCases;
  readonly selection: MediaSelection;
  /** The list being looked at, left out of the picker. */
  readonly excludeListId?: number;
}): BulkActions => {
  const t = useTranslate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<AppError | null>(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [addedTo, setAddedTo] = useState<readonly number[]>([]);
  const count = selection.selected.length;

  const lists = useQuery({
    queryKey: accountKeys.lists,
    queryFn: async () => getOrThrow(await account.getLists(1)),
    enabled: isPickerOpen,
  });

  const save = useMutation({
    mutationFn: async (media: readonly MediaSummary[]) => getOrThrow(await watchlist.addToWatchlist(media)),
    onMutate: () => {
      setError(null);
    },
    onSuccess: () => {
      successFeedback();
      selection.end();
    },
    onError: setError,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });

  const unsave = useMutation({
    mutationFn: async (refs: readonly MediaRef[]) => getOrThrow(await watchlist.removeFromWatchlist(refs)),
    onMutate: (refs) => {
      setError(null);
      queryClient.setQueryData(watchlistKeys.all, (entries: readonly WatchlistEntry[] | undefined) =>
        entries?.filter((entry) => !refs.some((ref) => sameMedia(ref, entry.media.ref))),
      );
      selection.end();
    },
    onSuccess: successFeedback,
    onError: setError,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });

  const add = useMutation({
    mutationFn: async ({ list, refs }: { list: UserList; refs: readonly MediaRef[] }) =>
      getOrThrow(await account.addToList(list.id, refs)),
    onMutate: ({ list }) => {
      setError(null);
      setAddedTo([...addedTo, list.id]);
    },
    onSuccess: (_, { list }) => {
      successFeedback();
      void queryClient.invalidateQueries({ queryKey: accountKeys.list(list.id) });
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists });
    },
    onError: (failure, { list }) => {
      setAddedTo(addedTo.filter((id) => id !== list.id));
      setPickerOpen(false);
      setError(failure);
    },
  });

  return {
    isWorking: save.isPending || unsave.isPending || add.isPending,
    error,
    dismissError: () => {
      setError(null);
    },
    addToWatchlist: () => {
      if (count > 0) save.mutate(selection.selected);
    },
    removeFromWatchlist: () => {
      if (count === 0) return;
      const refs = selection.selected.map((media) => media.ref);
      void confirmDestructive({
        title: t({ key: 'account.removeFromWatchlistTitle', params: { count } }),
        message: t({ key: 'account.removeMessage' }),
        confirmLabel: t({ key: 'common.remove' }),
        cancelLabel: t({ key: 'common.cancel' }),
      }).then((confirmed) => {
        if (confirmed) unsave.mutate(refs);
      });
    },
    openListPicker: () => {
      if (count === 0) return;
      setAddedTo([]);
      setPickerOpen(true);
    },
    listPicker: {
      visible: isPickerOpen,
      title: t({ key: 'account.addTitlesToList', params: { count } }),
      lists: (lists.data?.items ?? []).filter((list) => list.id !== excludeListId),
      isLoading: lists.isPending,
      addedTo,
      pick: (list) => {
        if (!addedTo.includes(list.id))
          add.mutate({ list, refs: selection.selected.map((media) => media.ref) });
      },
      close: () => {
        setPickerOpen(false);
        if (addedTo.length > 0) selection.end();
      },
    },
  };
};
