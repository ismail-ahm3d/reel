import type { HttpClient } from '@shared/core/data/http/httpClient';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { Authorizer } from '@features/account/domain/repositories/authorizer';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';
import { makeGetAccount } from '@features/account/domain/usecases/getAccount';
import { makeSignIn } from '@features/account/domain/usecases/signIn';
import { makeSignOut } from '@features/account/domain/usecases/signOut';
import { makeGetAccountStates } from '@features/account/domain/usecases/getAccountStates';
import { makeRateTitle } from '@features/account/domain/usecases/rateTitle';
import { makeSetFavorite } from '@features/account/domain/usecases/setFavorite';
import { makeGetFavorites } from '@features/account/domain/usecases/getFavorites';
import { makeGetRated } from '@features/account/domain/usecases/getRated';
import { makeGetRecommendations } from '@features/account/domain/usecases/getRecommendations';
import { makeGetLists } from '@features/account/domain/usecases/getLists';
import { makeGetList } from '@features/account/domain/usecases/getList';
import { makeCreateList } from '@features/account/domain/usecases/createList';
import { makeAddToList } from '@features/account/domain/usecases/addToList';
import { makeRemoveFromList } from '@features/account/domain/usecases/removeFromList';
import { makeDeleteList } from '@features/account/domain/usecases/deleteList';
import { makeAccountRemoteDataSource } from '@features/account/data/datasources/remote/accountRemoteDataSource';
import { makeAccountRepository } from '@features/account/data/repositories/accountRepositoryImpl';

export type AccountClients = {
  /** The v3 API, with the app's read token. */
  readonly v3: HttpClient;
  /** The v4 API, with the app's read token; user calls add the user's own. */
  readonly v4: HttpClient;
  readonly sessions: SessionRepository;
  readonly authorizer: Authorizer;
  /** Where TMDB sends the user back after approving: the app's own URL scheme. */
  readonly redirectUrl: string;
  readonly language: string;
};

export const makeAccount = ({
  v3,
  v4,
  sessions,
  authorizer,
  redirectUrl,
  language,
}: AccountClients): AccountUseCases => {
  const account = makeAccountRepository({ remote: makeAccountRemoteDataSource({ v3, v4 }), language });
  const deps = { account, sessions };
  return {
    getAccount: makeGetAccount(deps),
    signIn: makeSignIn({ ...deps, authorizer, redirectUrl }),
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
