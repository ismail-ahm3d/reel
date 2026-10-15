import type { Clock } from '@shared/core/domain/clock';
import { aMedia } from '@shared/domain/model/media.testing';
import { makeFakeWatchlistRepository } from '@shared/domain/repositories/watchlistRepository.fake';
import { makeAddToWatchlist } from '@shared/domain/usecases/addToWatchlist';
import { makeGetWatchlist } from '@shared/domain/usecases/getWatchlist';
import { makeRemoveFromWatchlist } from '@shared/domain/usecases/removeFromWatchlist';

const clock: Clock = { now: () => new Date('2026-10-15T10:00:00Z') };

describe('addToWatchlist', () => {
  it('saves every title, the first one given listed first', async () => {
    const fake = makeFakeWatchlistRepository([{ media: aMedia({ id: 9 }), addedAt: new Date('2026-01-01') }]);
    const result = await makeAddToWatchlist({ watchlist: fake.repository, clock })([
      aMedia({ id: 1 }),
      aMedia({ id: 2, type: 'tv' }),
    ]);
    expect(result).toEqual({ ok: true, value: undefined });
    const listed = await makeGetWatchlist({ watchlist: fake.repository })();
    expect(listed.ok && listed.value.map((entry) => entry.media.ref.id)).toEqual([1, 2, 9]);
  });

  it('keeps one entry for a title that was already saved', async () => {
    const fake = makeFakeWatchlistRepository([{ media: aMedia({ id: 1 }), addedAt: new Date('2026-01-01') }]);
    await makeAddToWatchlist({ watchlist: fake.repository, clock })([aMedia({ id: 1 })]);
    expect(fake.stored()).toHaveLength(1);
  });
});

describe('removeFromWatchlist', () => {
  it('removes exactly the titles given', async () => {
    const fake = makeFakeWatchlistRepository(
      [1, 2, 3].map((id) => ({ media: aMedia({ id }), addedAt: clock.now() })),
    );
    await makeRemoveFromWatchlist({ watchlist: fake.repository })([
      { type: 'movie', id: 1 },
      { type: 'movie', id: 3 },
    ]);
    expect(fake.stored().map((entry) => entry.media.ref.id)).toEqual([2]);
  });
});
