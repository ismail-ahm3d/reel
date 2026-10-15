import { toMediaSummary, toPage } from '@shared/data/mappers/tmdbMappers';
import type { AccountRepository } from '@features/account/domain/repositories/accountRepository';
import type { AccountRemoteDataSource } from '@features/account/data/datasources/remote/accountRemoteDataSource';
import {
  toAccount,
  toAccountStates,
  toRatedTitle,
  toUserList,
} from '@features/account/data/mappers/accountMappers';

const approvePage = 'https://www.themoviedb.org/auth/access';

/** Titles sent per list request, so one large selection does not become one oversized body. */
const listChunk = 50;

const chunked = <T>(items: readonly T[]): T[][] =>
  Array.from({ length: Math.ceil(items.length / listChunk) }, (_, index) =>
    items.slice(index * listChunk, (index + 1) * listChunk),
  );

export const makeAccountRepository = ({
  remote,
  language,
}: {
  remote: AccountRemoteDataSource;
  /** ISO 639-1, the language new lists are filed under. */
  language: string;
}): AccountRepository => ({
  requestApproval: async (redirectUrl) => {
    const requestToken = await remote.requestToken(redirectUrl);
    return { requestToken, approveUrl: `${approvePage}?request_token=${encodeURIComponent(requestToken)}` };
  },
  createSession: async (requestToken) => {
    const { accessToken, accountObjectId } = await remote.accessToken(requestToken);
    const sessionId = await remote.sessionFor(accessToken);
    const account = await remote.account({ accessToken, accountObjectId, sessionId, accountId: 0 });
    return { accessToken, accountObjectId, sessionId, accountId: account.id };
  },
  endSession: (session) => remote.endSession(session),
  account: async (session) => toAccount(await remote.account(session)),
  states: async (session, ref) => toAccountStates(await remote.states(session, ref)),
  rate: (session, ref, value) => remote.rate(session, ref, value),
  unrate: (session, ref) => remote.rate(session, ref, null),
  setFavorite: (session, ref, favorite) => remote.favorite(session, ref, favorite),
  favorites: async (session, type, page) =>
    toPage(await remote.favorites(session, type, page), (dto) => toMediaSummary(dto, type)),
  rated: async (session, type, page) =>
    toPage(await remote.rated(session, type, page), (dto) => toRatedTitle(dto, type)),
  recommendations: async (session, type, page) =>
    toPage(await remote.recommendations(session, type, page), (dto) => toMediaSummary(dto, type)),
  lists: async (session, page) => toPage(await remote.lists(session, page), toUserList),
  list: async (session, listId, page) => {
    const dto = await remote.list(session, listId, page);
    return {
      list: toUserList({ ...dto, number_of_items: dto.total_results }),
      items: toPage(dto, (item) => toMediaSummary(item, 'movie')),
    };
  },
  createList: (session, name, description) => remote.createList(session, name, description, language),
  addToList: async (session, listId, refs) => {
    for (const chunk of chunked(refs)) await remote.listItems(session, listId, chunk, true);
  },
  removeFromList: async (session, listId, refs) => {
    for (const chunk of chunked(refs)) await remote.listItems(session, listId, chunk, false);
  },
  deleteList: (session, listId) => remote.deleteList(session, listId),
});
