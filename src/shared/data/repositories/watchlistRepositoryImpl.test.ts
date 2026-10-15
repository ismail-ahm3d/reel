import { StorageError, UnknownError } from '@shared/core/domain/appError';
import { makeMemoryStorage } from '@shared/core/data/storage/memoryStorage.fake';
import { aMedia } from '@shared/domain/model/media.testing';
import { makeWatchlistStorageDataSource } from '@shared/data/datasources/storage/watchlistStorageDataSource';
import { makeWatchlistRepository } from '@shared/data/repositories/watchlistRepositoryImpl';
import type { AccountWatchlistRemoteDataSource } from '@shared/data/datasources/remote/accountWatchlistRemoteDataSource';
import { aSession, makeFakeSessionRepository } from '@shared/domain/repositories/sessionRepository.fake';

/** A remote watchlist in memory: ids saved per type. */
const makeRemote = (initial: { movie: number[]; tv: number[] } = { movie: [], tv: [] }) => {
  const saved = { movie: [...initial.movie], tv: [...initial.tv] };
  const remote: AccountWatchlistRemoteDataSource = {
    page: (_session, type) =>
      Promise.resolve({
        page: 1,
        total_pages: 1,
        total_results: saved[type].length,
        results: saved[type].map((id) => ({ id, title: `T${id}`, name: `T${id}` })),
      }),
    set: (_session, type, id, on) => {
      saved[type] = on ? [id, ...saved[type].filter((x) => x !== id)] : saved[type].filter((x) => x !== id);
      return Promise.resolve();
    },
  };
  return { remote, saved };
};

const setup = (initial: Readonly<Record<string, string>> = {}) => {
  const { storage, values } = makeMemoryStorage(initial);
  return {
    repository: makeWatchlistRepository({
      local: makeWatchlistStorageDataSource({ storage }),
      remote: makeRemote().remote,
      sessions: makeFakeSessionRepository().repository,
    }),
    values,
  };
};

describe('watchlistRepository', () => {
  it('reads back what it saved, dates included', async () => {
    const { repository } = setup();
    const entry = { media: aMedia({ id: 3, type: 'tv' }), addedAt: new Date('2026-10-01T08:00:00Z') };
    await repository.add([entry]);
    expect(await repository.list()).toEqual([entry]);
  });

  it('removes only the matching title', async () => {
    const { repository } = setup();
    await repository.add([{ media: aMedia({ id: 1 }), addedAt: new Date() }]);
    await repository.add([{ media: aMedia({ id: 2 }), addedAt: new Date() }]);
    await repository.remove([{ type: 'movie', id: 1 }]);
    expect((await repository.list()).map((entry) => entry.media.ref.id)).toEqual([2]);
  });

  it('adds and removes several titles at once, without saving one twice', async () => {
    const { repository } = setup();
    await repository.add([{ media: aMedia({ id: 1 }), addedAt: new Date() }]);
    await repository.add([1, 2, 3, 4].map((id) => ({ media: aMedia({ id }), addedAt: new Date() })));
    expect((await repository.list()).map((entry) => entry.media.ref.id)).toEqual([1, 2, 3, 4]);
    await repository.remove([
      { type: 'movie', id: 1 },
      { type: 'movie', id: 3 },
    ]);
    expect((await repository.list()).map((entry) => entry.media.ref.id)).toEqual([2, 4]);
  });

  it('turns a stored value that no longer parses into an AppError', async () => {
    const { repository } = setup({ 'watchlist.v1': '[{"nope":true}]' });
    await expect(repository.list()).rejects.toBeInstanceOf(UnknownError);
  });

  it('maps a full disk to a storage failure', async () => {
    const { storage } = makeMemoryStorage();
    const full = {
      ...storage,
      setItem: async () => Promise.reject(new Error('SQLITE_FULL: database or disk is full')),
    };
    const repository = makeWatchlistRepository({
      local: makeWatchlistStorageDataSource({ storage: full }),
      remote: makeRemote().remote,
      sessions: makeFakeSessionRepository().repository,
    });
    await expect(repository.add([{ media: aMedia(), addedAt: new Date() }])).rejects.toBeInstanceOf(
      StorageError,
    );
  });

  it('uses the TMDB watchlist when signed in and moves device titles there', async () => {
    const { storage } = makeMemoryStorage();
    const local = makeWatchlistStorageDataSource({ storage });
    const signedOut = makeWatchlistRepository({
      local,
      remote: makeRemote().remote,
      sessions: makeFakeSessionRepository().repository,
    });
    await signedOut.add([{ media: aMedia({ id: 5 }), addedAt: new Date() }]);
    const remote = makeRemote({ movie: [9], tv: [3] });
    const signedIn = makeWatchlistRepository({
      local,
      remote: remote.remote,
      sessions: makeFakeSessionRepository(aSession).repository,
    });
    expect((await signedIn.list()).map((entry) => `${entry.media.ref.type}:${entry.media.ref.id}`)).toEqual([
      'movie:5',
      'tv:3',
      'movie:9',
    ]);
    expect(await local.read()).toEqual([]);
    await signedIn.remove([{ type: 'tv', id: 3 }]);
    expect(remote.saved.tv).toEqual([]);
    await signedIn.add(
      [11, 12, 13, 14, 15, 16, 17].map((id) => ({ media: aMedia({ id, type: 'tv' }), addedAt: new Date() })),
    );
    expect([...remote.saved.tv].sort((a, b) => a - b)).toEqual([11, 12, 13, 14, 15, 16, 17]);
  });
});
