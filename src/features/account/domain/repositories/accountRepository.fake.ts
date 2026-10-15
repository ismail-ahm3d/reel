import { NetworkError } from '@shared/core/domain/appError';
import type { MediaRef } from '@shared/domain/model/media';
import { aSession } from '@shared/domain/repositories/sessionRepository.fake';
import type { Account, AccountStates } from '@features/account/domain/model/account';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';

export const anAccount: Account = { id: 7, username: 'reel', name: 'Reel Tester', avatar: null };

const empty = { items: [], page: 1, totalPages: 1, totalResults: 0 };

/** An in-memory TMDB account: ratings and favorites by "type:id". */
export const makeFakeAccountRepository = () => {
  const ratings = new Map<string, number>();
  const favorites = new Set<string>();
  const listItems = new Map<number, MediaRef[]>();
  const key = (ref: MediaRef) => `${ref.type}:${ref.id}`;
  let unreachable = false;
  const repository: AccountRepository = {
    requestApproval: (redirectUrl) =>
      Promise.resolve({ requestToken: 'request', approveUrl: `https://tmdb/approve?to=${redirectUrl}` }),
    createSession: () => Promise.resolve(aSession),
    endSession: () =>
      unreachable ? Promise.reject(new NetworkError({ kind: 'unreachable' })) : Promise.resolve(),
    account: () => Promise.resolve(anAccount),
    states: (_session, ref): Promise<AccountStates> =>
      Promise.resolve({
        favorite: favorites.has(key(ref)),
        watchlist: false,
        rating: ratings.get(key(ref)) ?? null,
      }),
    rate: (_session, ref, value) => {
      ratings.set(key(ref), value);
      return Promise.resolve();
    },
    unrate: (_session, ref) => {
      ratings.delete(key(ref));
      return Promise.resolve();
    },
    setFavorite: (_session, ref, on) => {
      if (on) favorites.add(key(ref));
      else favorites.delete(key(ref));
      return Promise.resolve();
    },
    favorites: () => Promise.resolve(empty),
    rated: () => Promise.resolve(empty),
    recommendations: () => Promise.resolve(empty),
    lists: () => Promise.resolve(empty),
    list: (_session, listId) =>
      Promise.resolve({
        list: { id: listId, name: 'List', description: '', itemCount: 0, isPublic: true, backdrop: null },
        items: empty,
      }),
    createList: () => Promise.resolve(1),
    addToList: (_session, listId, refs) => {
      const current = listItems.get(listId) ?? [];
      listItems.set(listId, [
        ...current.filter((item) => !refs.some((ref) => key(ref) === key(item))),
        ...refs,
      ]);
      return Promise.resolve();
    },
    removeFromList: (_session, listId, refs) => {
      const current = listItems.get(listId) ?? [];
      listItems.set(
        listId,
        current.filter((item) => !refs.some((ref) => key(ref) === key(item))),
      );
      return Promise.resolve();
    },
    deleteList: () => Promise.resolve(),
  };
  return {
    repository,
    ratings,
    listItems,
    goOffline: () => {
      unreachable = true;
    },
  };
};
