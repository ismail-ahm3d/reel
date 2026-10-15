import type { HttpClient, Headers } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import type { MediaItemDto, PageDto } from '@shared/data/datasources/remote/tmdbDto';
import type { MediaRef, MediaType } from '@shared/domain/model/media';
import type { Session } from '@shared/domain/model/session';
import {
  accessTokenDtoSchema,
  accountDtoSchema,
  accountStatesDtoSchema,
  createdListDtoSchema,
  listDetailsDtoSchema,
  listPageDtoSchema,
  mediaPageDtoSchema,
  ratedPageDtoSchema,
  requestTokenDtoSchema,
  sessionDtoSchema,
  type AccountDto,
  type AccountStatesDto,
  type ListDetailsDto,
  type ListDto,
  type RatedItemDto,
} from '@features/account/data/datasources/remote/accountDto';

/** Every function may throw AppError; nothing else. */
export type AccountRemoteDataSource = {
  readonly requestToken: (redirectUrl: string) => Promise<string>;
  readonly accessToken: (
    requestToken: string,
  ) => Promise<{ readonly accessToken: string; readonly accountObjectId: string }>;
  readonly sessionFor: (accessToken: string) => Promise<string>;
  readonly endSession: (session: Session) => Promise<void>;
  readonly account: (session: Session) => Promise<AccountDto>;
  readonly states: (session: Session, ref: MediaRef) => Promise<AccountStatesDto>;
  readonly rate: (session: Session, ref: MediaRef, value: number | null) => Promise<void>;
  readonly favorite: (session: Session, ref: MediaRef, favorite: boolean) => Promise<void>;
  readonly favorites: (session: Session, type: MediaType, page: number) => Promise<PageDto<MediaItemDto>>;
  readonly rated: (session: Session, type: MediaType, page: number) => Promise<PageDto<RatedItemDto>>;
  readonly recommendations: (
    session: Session,
    type: MediaType,
    page: number,
  ) => Promise<PageDto<MediaItemDto>>;
  readonly lists: (session: Session, page: number) => Promise<PageDto<ListDto>>;
  readonly list: (session: Session, listId: number, page: number) => Promise<ListDetailsDto>;
  readonly createList: (
    session: Session,
    name: string,
    description: string,
    language: string,
  ) => Promise<number>;
  readonly listItems: (
    session: Session,
    listId: number,
    refs: readonly MediaRef[],
    add: boolean,
  ) => Promise<void>;
  readonly deleteList: (session: Session, listId: number) => Promise<void>;
};

const plural = (type: MediaType) => (type === 'movie' ? 'movies' : 'tv');

/**
 * v3 for ratings, favorites and the account (addressed by session id), v4 for sign-in, lists and
 * recommendations (addressed by the user's own access token).
 */
export const makeAccountRemoteDataSource = ({
  v3,
  v4,
}: {
  v3: HttpClient;
  v4: HttpClient;
}): AccountRemoteDataSource => {
  const user = (session: Session): Headers => ({ Authorization: `Bearer ${session.accessToken}` });
  const sessionQuery = (session: Session) => ({ session_id: session.sessionId });
  return {
    requestToken: (redirectUrl) =>
      remoteOutcome(
        async () =>
          requestTokenDtoSchema.parse(
            await v4.send('POST', 'auth/request_token', { redirect_to: redirectUrl }),
          ).request_token,
      ),
    accessToken: (requestToken) =>
      remoteOutcome(async () => {
        const dto = accessTokenDtoSchema.parse(
          await v4.send('POST', 'auth/access_token', { request_token: requestToken }),
        );
        return { accessToken: dto.access_token, accountObjectId: dto.account_id };
      }),
    sessionFor: (accessToken) =>
      remoteOutcome(
        async () =>
          sessionDtoSchema.parse(
            await v3.send('POST', 'authentication/session/convert/4', { access_token: accessToken }),
          ).session_id,
      ),
    endSession: (session) =>
      remoteOutcome(async () => {
        await v4.send('DELETE', 'auth/access_token', { access_token: session.accessToken });
        await v3.send('DELETE', 'authentication/session', { session_id: session.sessionId });
      }),
    account: (session) =>
      remoteOutcome(async () => accountDtoSchema.parse(await v3.get('account', sessionQuery(session)))),
    states: (session, ref) =>
      remoteOutcome(async () =>
        accountStatesDtoSchema.parse(
          await v3.get(`${ref.type}/${ref.id}/account_states`, sessionQuery(session)),
        ),
      ),
    rate: (session, ref, value) =>
      remoteOutcome(async () => {
        if (value === null)
          await v3.send('DELETE', `${ref.type}/${ref.id}/rating`, undefined, sessionQuery(session));
        else await v3.send('POST', `${ref.type}/${ref.id}/rating`, { value }, sessionQuery(session));
      }),
    favorite: (session, ref, favorite) =>
      remoteOutcome(async () => {
        await v3.send(
          'POST',
          `account/${session.accountId}/favorite`,
          { media_type: ref.type, media_id: ref.id, favorite },
          sessionQuery(session),
        );
      }),
    favorites: (session, type, page) =>
      remoteOutcome(async () =>
        mediaPageDtoSchema.parse(
          await v3.get(`account/${session.accountId}/favorite/${plural(type)}`, {
            ...sessionQuery(session),
            sort_by: 'created_at.desc',
            page,
          }),
        ),
      ),
    rated: (session, type, page) =>
      remoteOutcome(async () =>
        ratedPageDtoSchema.parse(
          await v3.get(`account/${session.accountId}/rated/${plural(type)}`, {
            ...sessionQuery(session),
            sort_by: 'created_at.desc',
            page,
          }),
        ),
      ),
    recommendations: (session, type, page) =>
      remoteOutcome(async () =>
        mediaPageDtoSchema.parse(
          await v4.get(
            `account/${session.accountObjectId}/${type}/recommendations`,
            { page },
            undefined,
            user(session),
          ),
        ),
      ),
    lists: (session, page) =>
      remoteOutcome(async () =>
        listPageDtoSchema.parse(
          await v4.get(`account/${session.accountObjectId}/lists`, { page }, undefined, user(session)),
        ),
      ),
    list: (session, listId, page) =>
      remoteOutcome(async () =>
        listDetailsDtoSchema.parse(await v4.get(`list/${listId}`, { page }, undefined, user(session))),
      ),
    createList: (session, name, description, language) =>
      remoteOutcome(
        async () =>
          createdListDtoSchema.parse(
            await v4.send(
              'POST',
              'list',
              { name, description, iso_639_1: language, public: true },
              undefined,
              user(session),
            ),
          ).id,
      ),
    listItems: (session, listId, refs, add) =>
      remoteOutcome(async () => {
        await v4.send(
          add ? 'POST' : 'DELETE',
          `list/${listId}/items`,
          { items: refs.map((ref) => ({ media_type: ref.type, media_id: ref.id })) },
          undefined,
          user(session),
        );
      }),
    deleteList: (session, listId) =>
      remoteOutcome(async () => {
        await v4.send('DELETE', `list/${listId}`, undefined, undefined, user(session));
      }),
  };
};
