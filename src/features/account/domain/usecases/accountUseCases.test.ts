import { aSession, makeFakeSessionRepository } from '@shared/domain/repositories/sessionRepository.fake';
import { AccountError } from '@features/account/domain/model/accountError';
import {
  anAccount,
  makeFakeAccountRepository,
} from '@features/account/domain/repositories/accountRepository.fake';
import { makeGetAccount } from '@features/account/domain/usecases/getAccount';
import { makeAddToList } from '@features/account/domain/usecases/addToList';
import { makeCreateList } from '@features/account/domain/usecases/createList';
import { makeRateTitle } from '@features/account/domain/usecases/rateTitle';
import { makeRemoveFromList } from '@features/account/domain/usecases/removeFromList';
import { makeSignIn } from '@features/account/domain/usecases/signIn';
import { makeSignOut } from '@features/account/domain/usecases/signOut';

const movie = { type: 'movie', id: 550 } as const;

describe('signIn', () => {
  it('opens TMDB with the redirect, then keeps the session', async () => {
    const account = makeFakeAccountRepository();
    const sessions = makeFakeSessionRepository();
    const authorizer = jest.fn(() => Promise.resolve(true));
    const result = await makeSignIn({
      account: account.repository,
      sessions: sessions.repository,
      authorizer,
      redirectUrl: 'reel://auth',
    })();
    expect(result).toEqual({ ok: true, value: anAccount });
    expect(authorizer).toHaveBeenCalledWith('https://tmdb/approve?to=reel://auth', 'reel://auth');
    expect(sessions.current()).toEqual(aSession);
  });

  it('keeps nobody signed in when the user closes the page', async () => {
    const sessions = makeFakeSessionRepository();
    const result = await makeSignIn({
      account: makeFakeAccountRepository().repository,
      sessions: sessions.repository,
      authorizer: () => Promise.resolve(false),
      redirectUrl: 'reel://auth',
    })();
    expect(!result.ok && result.error).toEqual(new AccountError({ kind: 'notApproved' }));
    expect(sessions.current()).toBeNull();
  });
});

describe('signOut', () => {
  it('forgets the session even when TMDB cannot be reached', async () => {
    const account = makeFakeAccountRepository();
    account.goOffline();
    const sessions = makeFakeSessionRepository(aSession);
    expect((await makeSignOut({ account: account.repository, sessions: sessions.repository })()).ok).toBe(
      true,
    );
    expect(sessions.current()).toBeNull();
  });
});

describe('getAccount', () => {
  it('is null while signed out', async () => {
    const result = await makeGetAccount({
      account: makeFakeAccountRepository().repository,
      sessions: makeFakeSessionRepository().repository,
    })();
    expect(result).toEqual({ ok: true, value: null });
  });
});

describe('rateTitle', () => {
  it('saves half steps and refuses scores TMDB would reject', async () => {
    const account = makeFakeAccountRepository();
    const rate = makeRateTitle({
      account: account.repository,
      sessions: makeFakeSessionRepository(aSession).repository,
    });
    expect(await rate(movie, 7.5)).toEqual({ ok: true, value: 7.5 });
    expect(account.ratings.get('movie:550')).toBe(7.5);
    expect((await rate(movie, 7.3)).ok).toBe(false);
    expect(await rate(movie, null)).toEqual({ ok: true, value: null });
    expect(account.ratings.has('movie:550')).toBe(false);
  });

  it('asks for a session first', async () => {
    const rate = makeRateTitle({
      account: makeFakeAccountRepository().repository,
      sessions: makeFakeSessionRepository().repository,
    });
    const result = await rate(movie, 8);
    expect(!result.ok && result.error).toEqual(new AccountError({ kind: 'signedOut' }));
  });
});

describe('createList', () => {
  it('refuses a blank name', async () => {
    const create = makeCreateList({
      account: makeFakeAccountRepository().repository,
      sessions: makeFakeSessionRepository(aSession).repository,
    });
    expect((await create('   ', '')).ok).toBe(false);
    expect(await create(' Noir ', '')).toEqual({ ok: true, value: 1 });
  });
});

describe('list items', () => {
  const show = { type: 'tv', id: 1399 } as const;

  it('adds and removes several titles in one go', async () => {
    const account = makeFakeAccountRepository();
    const deps = { account: account.repository, sessions: makeFakeSessionRepository(aSession).repository };
    expect((await makeAddToList(deps)(4, [movie, show])).ok).toBe(true);
    expect(account.listItems.get(4)).toEqual([movie, show]);
    await makeRemoveFromList(deps)(4, [movie]);
    expect(account.listItems.get(4)).toEqual([show]);
  });

  it('needs someone signed in', async () => {
    const result = await makeAddToList({
      account: makeFakeAccountRepository().repository,
      sessions: makeFakeSessionRepository().repository,
    })(4, [movie]);
    expect(!result.ok && result.error).toEqual(new AccountError({ kind: 'signedOut' }));
  });
});
