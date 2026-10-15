import type { MediaRef, MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { Session } from '@shared/domain/model/session';
import type {
  Account,
  AccountStates,
  ListPage,
  RatedTitle,
  UserList,
} from '@features/account/domain/model/account';

/** Every function may throw AppError; nothing else. */
export type AccountRepository = {
  /** A request token, and the page where the user approves it. */
  readonly requestApproval: (
    redirectUrl: string,
  ) => Promise<{ readonly requestToken: string; readonly approveUrl: string }>;
  readonly createSession: (requestToken: string) => Promise<Session>;
  readonly endSession: (session: Session) => Promise<void>;
  readonly account: (session: Session) => Promise<Account>;
  readonly states: (session: Session, ref: MediaRef) => Promise<AccountStates>;
  readonly rate: (session: Session, ref: MediaRef, value: number) => Promise<void>;
  readonly unrate: (session: Session, ref: MediaRef) => Promise<void>;
  readonly setFavorite: (session: Session, ref: MediaRef, favorite: boolean) => Promise<void>;
  readonly favorites: (session: Session, type: MediaType, page: number) => Promise<Page<MediaSummary>>;
  readonly rated: (session: Session, type: MediaType, page: number) => Promise<Page<RatedTitle>>;
  readonly recommendations: (session: Session, type: MediaType, page: number) => Promise<Page<MediaSummary>>;
  readonly lists: (session: Session, page: number) => Promise<Page<UserList>>;
  readonly list: (session: Session, listId: number, page: number) => Promise<ListPage>;
  readonly createList: (session: Session, name: string, description: string) => Promise<number>;
  readonly addToList: (session: Session, listId: number, refs: readonly MediaRef[]) => Promise<void>;
  readonly removeFromList: (session: Session, listId: number, refs: readonly MediaRef[]) => Promise<void>;
  readonly deleteList: (session: Session, listId: number) => Promise<void>;
};
