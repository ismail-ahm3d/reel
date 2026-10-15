import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback, successFeedback } from '@shared/core/presentation/feedback/haptics';
import type { MediaRef } from '@shared/domain/model/media';
import type { AccountStates, UserList } from '@features/account/domain/model/account';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { accountKeys } from '@features/account/presentation/queryKeys';

export type TitleAccountBarProps = {
  readonly mediaRef: MediaRef;
  readonly title: string;
  readonly useCases: AccountUseCases;
};

export type TitleAccountBarView = {
  /** Null when nobody is signed in: the bar is not shown. */
  readonly states: AccountStates | null;
  readonly title: string;
  readonly lists: readonly UserList[];
  readonly addedTo: readonly number[];
  readonly isRatingSheetOpen: boolean;
  readonly isListSheetOpen: boolean;
  readonly isListsLoading: boolean;
  readonly isBusy: boolean;
  readonly actionError: AppError | null;
  readonly toggleFavorite: () => void;
  readonly openRating: () => void;
  readonly closeRating: () => void;
  readonly rate: (value: number | null) => void;
  readonly openLists: () => void;
  readonly closeLists: () => void;
  readonly addToList: (list: UserList) => void;
  readonly dismissActionError: () => void;
};

/**
 * The signed-in user's actions on a title page: favorite, rate, add to a list. It is a slot the
 * title route fills, so it owns its queries like a screen hook does.
 */
export const useTitleAccountBar = ({
  mediaRef,
  title,
  useCases,
}: TitleAccountBarProps): TitleAccountBarView => {
  const queryClient = useQueryClient();
  const [isRatingSheetOpen, setRatingSheetOpen] = useState(false);
  const [isListSheetOpen, setListSheetOpen] = useState(false);
  const [addedTo, setAddedTo] = useState<readonly number[]>([]);
  const [actionError, setActionError] = useState<AppError | null>(null);

  const key = accountKeys.states(mediaRef);
  const states = useQuery({
    queryKey: key,
    queryFn: async () => getOrThrow(await useCases.getAccountStates(mediaRef)),
  });

  const lists = useQuery({
    queryKey: accountKeys.lists,
    queryFn: async () => getOrThrow(await useCases.getLists(1)),
    enabled: isListSheetOpen,
  });

  /** Writes the new state into the cache so the buttons answer at once. */
  const patch = (change: Partial<AccountStates>) => {
    queryClient.setQueryData(key, (current: AccountStates | null | undefined) =>
      current == null ? current : { ...current, ...change },
    );
  };

  const favorite = useMutation({
    mutationFn: async (on: boolean) => getOrThrow(await useCases.setFavorite(mediaRef, on)),
    onMutate: (on) => {
      setActionError(null);
      patch({ favorite: on });
    },
    onSuccess: (on) => {
      if (on) successFeedback();
      else selectionFeedback();
      void queryClient.invalidateQueries({ queryKey: accountKeys.favorites(mediaRef.type) });
    },
    onError: (error, on) => {
      patch({ favorite: !on });
      setActionError(error);
    },
  });

  const rating = useMutation({
    mutationFn: async (value: number | null) => getOrThrow(await useCases.rateTitle(mediaRef, value)),
    onMutate: (value) => {
      setActionError(null);
      setRatingSheetOpen(false);
      patch({ rating: value });
    },
    onSuccess: () => {
      successFeedback();
      void queryClient.invalidateQueries({ queryKey: accountKeys.rated(mediaRef.type) });
    },
    onError: (error) => {
      setActionError(error);
      void states.refetch();
    },
  });

  const add = useMutation({
    mutationFn: async (list: UserList) => getOrThrow(await useCases.addToList(list.id, [mediaRef])),
    onMutate: (list) => {
      setActionError(null);
      setAddedTo([...addedTo, list.id]);
    },
    onSuccess: (_, list) => {
      successFeedback();
      void queryClient.invalidateQueries({ queryKey: accountKeys.list(list.id) });
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists });
    },
    onError: (error, list) => {
      setAddedTo(addedTo.filter((id) => id !== list.id));
      setActionError(error);
    },
  });

  const current = states.data ?? null;

  return {
    states: current,
    title,
    lists: lists.data?.items ?? [],
    addedTo,
    isRatingSheetOpen,
    isListSheetOpen,
    isListsLoading: lists.isPending,
    isBusy: favorite.isPending || rating.isPending,
    actionError,
    toggleFavorite: () => {
      if (current !== null) favorite.mutate(!current.favorite);
    },
    openRating: () => {
      setRatingSheetOpen(true);
    },
    closeRating: () => {
      setRatingSheetOpen(false);
    },
    rate: (value) => {
      rating.mutate(value);
    },
    openLists: () => {
      setListSheetOpen(true);
    },
    closeLists: () => {
      setListSheetOpen(false);
    },
    addToList: (list) => {
      if (!addedTo.includes(list.id)) add.mutate(list);
    },
    dismissActionError: () => {
      setActionError(null);
    },
  };
};
