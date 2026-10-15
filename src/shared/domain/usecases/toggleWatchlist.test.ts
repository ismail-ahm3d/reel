import { NetworkError } from '@shared/core/domain/appError';
import type { Clock } from '@shared/core/domain/clock';
import { aMedia } from '@shared/domain/model/media.testing';
import { makeFakeWatchlistRepository } from '@shared/domain/repositories/watchlistRepository.fake';
import { makeGetWatchlist } from '@shared/domain/usecases/getWatchlist';
import { makeToggleWatchlist } from '@shared/domain/usecases/toggleWatchlist';

const clock: Clock = { now: () => new Date('2026-10-15T10:00:00Z') };

describe('toggleWatchlist', () => {
  it('saves a title that is not there and reports it saved', async () => {
    const fake = makeFakeWatchlistRepository();
    const result = await makeToggleWatchlist({ watchlist: fake.repository, clock })(aMedia({ id: 1 }));
    expect(result).toEqual({ ok: true, value: true });
    expect(fake.stored()).toEqual([{ media: aMedia({ id: 1 }), addedAt: clock.now() }]);
  });

  it('removes a title that is there', async () => {
    const fake = makeFakeWatchlistRepository([{ media: aMedia({ id: 1 }), addedAt: clock.now() }]);
    const result = await makeToggleWatchlist({ watchlist: fake.repository, clock })(aMedia({ id: 1 }));
    expect(result).toEqual({ ok: true, value: false });
    expect(fake.stored()).toEqual([]);
  });

  it('tells a movie and a show with the same id apart', async () => {
    const fake = makeFakeWatchlistRepository([
      { media: aMedia({ id: 1, type: 'tv' }), addedAt: clock.now() },
    ]);
    await makeToggleWatchlist({ watchlist: fake.repository, clock })(aMedia({ id: 1, type: 'movie' }));
    expect(fake.stored()).toHaveLength(2);
  });

  it('returns the failure as a value', async () => {
    const fake = makeFakeWatchlistRepository();
    const failure = new NetworkError({ kind: 'timeout' });
    fake.failWith(failure);
    expect(await makeToggleWatchlist({ watchlist: fake.repository, clock })(aMedia())).toEqual({
      ok: false,
      error: failure,
    });
  });
});

describe('getWatchlist', () => {
  it('lists the most recently added first', async () => {
    const fake = makeFakeWatchlistRepository([
      { media: aMedia({ id: 1 }), addedAt: new Date('2026-01-01') },
      { media: aMedia({ id: 2 }), addedAt: new Date('2026-03-01') },
    ]);
    const result = await makeGetWatchlist({ watchlist: fake.repository })();
    expect(result.ok && result.value.map((entry) => entry.media.ref.id)).toEqual([2, 1]);
  });
});
