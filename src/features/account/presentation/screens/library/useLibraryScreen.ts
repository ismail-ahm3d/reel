import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback, successFeedback } from '@shared/core/presentation/feedback/haptics';
import { mediaRefKey, nextPageOf, type MediaRef, type MediaSummary } from '@shared/domain/model/media';
import type { WatchlistUseCases } from '@shared/domain/usecases/sharedUseCases';
import { useMediaSelection, type MediaSelection } from '@shared/presentation/hooks/useMediaSelection';
import { watchlistKeys } from '@shared/presentation/query/sharedKeys';
import { isValidListName, type Account, type UserList } from '@features/account/domain/model/account';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { useBulkActions, type BulkActions } from '@features/account/presentation/hooks/useBulkActions';
import { useSignIn, type SignInState } from '@features/account/presentation/hooks/useSignIn';
import { accountKeys } from '@features/account/presentation/queryKeys';

export type LibraryScreenProps = {
  readonly account: AccountUseCases;
  readonly watchlist: WatchlistUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
  readonly onOpenList: (list: UserList) => void;
};

export type LibrarySection = 'watchlist' | 'favorites' | 'rated' | 'lists';
export type KindFilter = 'all' | 'movie' | 'tv';
export type BulkAction = 'addToWatchlist' | 'addToList' | 'removeFromWatchlist';

export type LibraryView = {
  readonly account: Account | null;
  readonly isSignedIn: boolean;
  readonly section: LibrarySection;
  /** Favorites and ratings come per type from TMDB, so they offer Movies and TV only. */
  readonly kinds: readonly KindFilter[];
  readonly kind: KindFilter;
  readonly items: readonly MediaSummary[];
  readonly lists: readonly UserList[];
  readonly recommendations: readonly MediaSummary[];
  /** The user's own score per title in the Rated section. */
  readonly ratingOf: (media: MediaSummary) => number | undefined;
  readonly needsSignIn: boolean;
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: AppError | null;
  readonly signIn: SignInState;
  readonly selection: MediaSelection;
  readonly bulk: BulkActions;
  /** What the picked titles can go through in this section. */
  readonly bulkActions: readonly BulkAction[];
  /** Whether the section's titles can be picked: only grids with something in them. */
  readonly canSelect: boolean;
  readonly startSelecting: (media?: MediaSummary) => void;
  readonly isCreatingList: boolean;
  readonly isCreateSheetOpen: boolean;
  readonly draftName: string;
  readonly draftDescription: string;
  readonly canCreateList: boolean;
  readonly createError: AppError | null;
  readonly retry: () => void;
  readonly loadMore: () => void;
  readonly setSection: (section: LibrarySection) => void;
  readonly setKind: (kind: KindFilter) => void;
  /** A tap in the grid: opens the title, or picks it while selecting. */
  readonly openMedia: (media: MediaSummary) => void;
  /** Opens the title whatever the grid is doing, for the recommendations rail. */
  readonly openTitle: (media: MediaSummary) => void;
  readonly openList: (list: UserList) => void;
  readonly openCreateSheet: () => void;
  readonly closeCreateSheet: () => void;
  readonly setDraftName: (name: string) => void;
  readonly setDraftDescription: (description: string) => void;
  readonly createList: () => void;
};

export const useLibraryScreen = ({
  account,
  watchlist,
  onOpenMedia,
  onOpenList,
}: LibraryScreenProps): LibraryView => {
  const queryClient = useQueryClient();
  const signIn = useSignIn(account);
  const selection = useMediaSelection();
  const bulk = useBulkActions({ account, watchlist, selection });
  const [section, setSection] = useState<LibrarySection>('watchlist');
  const [kind, setKind] = useState<KindFilter>('all');
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', description: '' });
  const [createError, setCreateError] = useState<AppError | null>(null);

  const me = useQuery({
    queryKey: accountKeys.me,
    queryFn: async () => getOrThrow(await account.getAccount()),
  });
  const isSignedIn = (me.data ?? null) !== null;
  const typeOf = kind === 'tv' ? 'tv' : 'movie';

  const saved = useQuery({
    queryKey: watchlistKeys.all,
    queryFn: async () => getOrThrow(await watchlist.getWatchlist()),
    enabled: section === 'watchlist',
  });

  const favorites = useInfiniteQuery({
    queryKey: accountKeys.favorites(typeOf),
    queryFn: async ({ pageParam }) => getOrThrow(await account.getFavorites(typeOf, pageParam)),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: isSignedIn && section === 'favorites',
  });

  const rated = useInfiniteQuery({
    queryKey: accountKeys.rated(typeOf),
    queryFn: async ({ pageParam }) => getOrThrow(await account.getRated(typeOf, pageParam)),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: isSignedIn && section === 'rated',
  });

  const lists = useInfiniteQuery({
    queryKey: accountKeys.lists,
    queryFn: async ({ pageParam }) => getOrThrow(await account.getLists(pageParam)),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: isSignedIn && section === 'lists',
  });

  const recommendations = useQuery({
    queryKey: accountKeys.recommendations('movie'),
    queryFn: async () => {
      const [movies, shows] = await Promise.all([
        account.getRecommendations('movie', 1),
        account.getRecommendations('tv', 1),
      ]);
      const movieItems = getOrThrow(movies).items;
      const showItems = getOrThrow(shows).items;
      // Alternate movies and shows so neither crowds the other out of the rail.
      return Array.from({ length: Math.max(movieItems.length, showItems.length) }, (_, index) => [
        movieItems[index],
        showItems[index],
      ])
        .flat()
        .filter((media): media is MediaSummary => media !== undefined);
    },
    enabled: isSignedIn && section === 'watchlist',
  });

  const create = useMutation({
    mutationFn: async () => getOrThrow(await account.createList(draft.name, draft.description)),
    onMutate: () => {
      setCreateError(null);
    },
    onSuccess: () => {
      successFeedback();
      setCreateSheetOpen(false);
      setDraft({ name: '', description: '' });
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists });
    },
    onError: setCreateError,
  });

  const ratings = new Map(
    (rated.data?.pages ?? [])
      .flatMap((page) => page.items)
      .map((item) => [mediaRefKey(item.media.ref), item.rating]),
  );

  const current = (() => {
    switch (section) {
      case 'watchlist':
        return {
          items: (saved.data ?? [])
            .map((entry) => entry.media)
            .filter((media) => kind === 'all' || media.ref.type === kind),
          isLoading: saved.isPending,
          isLoadingMore: false,
          error: saved.error,
          refetch: saved.refetch,
          next: () => undefined,
        };
      case 'favorites':
        return {
          items: (favorites.data?.pages ?? []).flatMap((page) => page.items),
          isLoading: favorites.isPending,
          isLoadingMore: favorites.isFetchingNextPage,
          error: favorites.data === undefined ? favorites.error : null,
          refetch: favorites.refetch,
          next: () =>
            favorites.hasNextPage && !favorites.isFetchingNextPage ? favorites.fetchNextPage() : undefined,
        };
      case 'rated':
        return {
          items: (rated.data?.pages ?? []).flatMap((page) => page.items.map((item) => item.media)),
          isLoading: rated.isPending,
          isLoadingMore: rated.isFetchingNextPage,
          error: rated.data === undefined ? rated.error : null,
          refetch: rated.refetch,
          next: () => (rated.hasNextPage && !rated.isFetchingNextPage ? rated.fetchNextPage() : undefined),
        };
      case 'lists':
        return {
          items: [],
          isLoading: lists.isPending,
          isLoadingMore: lists.isFetchingNextPage,
          error: lists.data === undefined ? lists.error : null,
          refetch: lists.refetch,
          next: () => (lists.hasNextPage && !lists.isFetchingNextPage ? lists.fetchNextPage() : undefined),
        };
    }
  })();

  const needsSignIn = !isSignedIn && section !== 'watchlist';
  const canSelect = section !== 'lists' && !needsSignIn && current.items.length > 0;
  const bulkActions: readonly BulkAction[] =
    section === 'watchlist'
      ? isSignedIn
        ? ['addToList', 'removeFromWatchlist']
        : ['removeFromWatchlist']
      : ['addToWatchlist', 'addToList'];

  return {
    account: me.data ?? null,
    isSignedIn,
    section,
    kinds: section === 'watchlist' ? ['all', 'movie', 'tv'] : ['movie', 'tv'],
    kind: section === 'watchlist' ? kind : typeOf,
    items: current.items,
    lists: (lists.data?.pages ?? []).flatMap((page) => page.items),
    recommendations: recommendations.data ?? [],
    ratingOf: (media) => ratings.get(mediaRefKey(media.ref)),
    needsSignIn,
    isLoading: !needsSignIn && (me.isPending || current.isLoading),
    isLoadingMore: current.isLoadingMore,
    error: needsSignIn ? null : current.error,
    signIn,
    selection,
    bulk,
    bulkActions,
    canSelect,
    startSelecting: (media) => {
      if (canSelect) selection.start(media);
    },
    isCreatingList: create.isPending,
    isCreateSheetOpen,
    draftName: draft.name,
    draftDescription: draft.description,
    canCreateList: isValidListName(draft.name) && !create.isPending,
    createError,
    retry: () => void current.refetch(),
    loadMore: () => void current.next(),
    setSection: (next) => {
      selectionFeedback();
      selection.end();
      setSection(next);
    },
    setKind: (next) => {
      selectionFeedback();
      selection.end();
      setKind(next);
    },
    openMedia: (media) => {
      if (selection.isSelecting) selection.toggle(media);
      else onOpenMedia(media.ref);
    },
    openTitle: (media) => {
      onOpenMedia(media.ref);
    },
    openList: onOpenList,
    openCreateSheet: () => {
      setCreateSheetOpen(true);
    },
    closeCreateSheet: () => {
      setCreateSheetOpen(false);
      setCreateError(null);
    },
    setDraftName: (name) => {
      setDraft({ ...draft, name });
    },
    setDraftDescription: (description) => {
      setDraft({ ...draft, description });
    },
    createList: () => {
      create.mutate();
    },
  };
};
