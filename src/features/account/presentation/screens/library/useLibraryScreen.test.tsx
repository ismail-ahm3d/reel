import { act, renderHook, waitFor } from '@testing-library/react-native';
import { makeQueryWrapper } from '@shared/core/presentation/query/queryClient.testing';
import { aMedia } from '@shared/domain/model/media.testing';
import { makeFakeSessionRepository } from '@shared/domain/repositories/sessionRepository.fake';
import { makeFakeWatchlistRepository } from '@shared/domain/repositories/watchlistRepository.fake';
import { makeAddToWatchlist } from '@shared/domain/usecases/addToWatchlist';
import { makeGetWatchlist } from '@shared/domain/usecases/getWatchlist';
import { makeRemoveFromWatchlist } from '@shared/domain/usecases/removeFromWatchlist';
import { makeToggleWatchlist } from '@shared/domain/usecases/toggleWatchlist';
import { makeFakeAccountRepository } from '@features/account/domain/repositories/accountRepository.fake';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { makeAddToList } from '@features/account/domain/usecases/addToList';
import { makeCreateList } from '@features/account/domain/usecases/createList';
import { makeDeleteList } from '@features/account/domain/usecases/deleteList';
import { makeGetAccount } from '@features/account/domain/usecases/getAccount';
import { makeGetAccountStates } from '@features/account/domain/usecases/getAccountStates';
import { makeGetFavorites } from '@features/account/domain/usecases/getFavorites';
import { makeGetList } from '@features/account/domain/usecases/getList';
import { makeGetLists } from '@features/account/domain/usecases/getLists';
import { makeGetRated } from '@features/account/domain/usecases/getRated';
import { makeGetRecommendations } from '@features/account/domain/usecases/getRecommendations';
import { makeRateTitle } from '@features/account/domain/usecases/rateTitle';
import { makeRemoveFromList } from '@features/account/domain/usecases/removeFromList';
import { makeSetFavorite } from '@features/account/domain/usecases/setFavorite';
import { makeSignIn } from '@features/account/domain/usecases/signIn';
import { makeSignOut } from '@features/account/domain/usecases/signOut';
import { useLibraryScreen } from '@features/account/presentation/screens/library/useLibraryScreen';

jest.mock('@shared/core/presentation/feedback/confirm', () => ({
  confirmDestructive: () => Promise.resolve(true),
}));

/** The real use cases over a fake TMDB account and a signed-out session. */
const accountUseCases = (): AccountUseCases => {
  const deps = {
    account: makeFakeAccountRepository().repository,
    sessions: makeFakeSessionRepository().repository,
  };
  return {
    getAccount: makeGetAccount(deps),
    signIn: makeSignIn({ ...deps, authorizer: () => Promise.resolve(false), redirectUrl: 'reel://auth' }),
    signOut: makeSignOut(deps),
    getAccountStates: makeGetAccountStates(deps),
    rateTitle: makeRateTitle(deps),
    setFavorite: makeSetFavorite(deps),
    getFavorites: makeGetFavorites(deps),
    getRated: makeGetRated(deps),
    getRecommendations: makeGetRecommendations(deps),
    getLists: makeGetLists(deps),
    getList: makeGetList(deps),
    createList: makeCreateList(deps),
    addToList: makeAddToList(deps),
    removeFromList: makeRemoveFromList(deps),
    deleteList: makeDeleteList(deps),
  };
};

const setup = async () => {
  const fake = makeFakeWatchlistRepository([
    { media: aMedia({ id: 1, type: 'movie' }), addedAt: new Date('2026-01-01') },
    { media: aMedia({ id: 2, type: 'tv' }), addedAt: new Date('2026-02-01') },
  ]);
  const { wrapper } = makeQueryWrapper();
  const clock = { now: () => new Date() };
  const onOpenMedia = jest.fn();
  const rendered = await renderHook(
    () =>
      useLibraryScreen({
        account: accountUseCases(),
        watchlist: {
          getWatchlist: makeGetWatchlist({ watchlist: fake.repository }),
          toggleWatchlist: makeToggleWatchlist({ watchlist: fake.repository, clock }),
          addToWatchlist: makeAddToWatchlist({ watchlist: fake.repository, clock }),
          removeFromWatchlist: makeRemoveFromWatchlist({ watchlist: fake.repository }),
        },
        onOpenMedia,
        onOpenList: jest.fn(),
      }),
    { wrapper },
  );
  return { ...rendered, fake, onOpenMedia };
};

describe('useLibraryScreen', () => {
  it('shows the device watchlist while signed out, newest first', async () => {
    const { result } = await setup();
    await waitFor(() => {
      expect(result.current.items.map((media) => media.ref.id)).toEqual([2, 1]);
    });
    expect(result.current.isSignedIn).toBe(false);
  });

  it('asks to sign in for favorites instead of failing', async () => {
    const { result } = await setup();
    await act(() => {
      result.current.setSection('favorites');
    });
    expect(result.current.needsSignIn).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.kinds).toEqual(['movie', 'tv']);
  });

  it('picks several titles and removes them together', async () => {
    const { result, fake, onOpenMedia } = await setup();
    await waitFor(() => {
      expect(result.current.items).toHaveLength(2);
    });
    expect(result.current.bulkActions).toEqual(['removeFromWatchlist']);
    await act(() => {
      result.current.startSelecting(result.current.items[0]);
    });
    await act(() => {
      result.current.openMedia(aMedia({ id: 1, type: 'movie' }));
    });
    expect(onOpenMedia).not.toHaveBeenCalled();
    expect(result.current.selection.selected.map((media) => media.ref.id)).toEqual([2, 1]);
    await act(async () => {
      result.current.bulk.removeFromWatchlist();
      await Promise.resolve();
    });
    await waitFor(() => {
      expect(fake.stored()).toEqual([]);
    });
    expect(result.current.selection.isSelecting).toBe(false);
  });

  it('selects all, and a second press clears them', async () => {
    const { result } = await setup();
    await waitFor(() => {
      expect(result.current.canSelect).toBe(true);
    });
    await act(() => {
      result.current.startSelecting();
    });
    await act(() => {
      result.current.selection.toggleAll(result.current.items);
    });
    expect(result.current.selection.allSelected(result.current.items)).toBe(true);
    await act(() => {
      result.current.selection.toggleAll(result.current.items);
    });
    expect(result.current.selection.selected).toEqual([]);
  });
});
