import type { HttpClient } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import type { MediaType } from '@shared/domain/model/media';
import type { Session } from '@shared/domain/model/session';
import {
  mediaItemDtoSchema,
  pageDtoSchema,
  type MediaItemDto,
  type PageDto,
} from '@shared/data/datasources/remote/tmdbDto';

/** Every function may throw AppError; nothing else. */
export type AccountWatchlistRemoteDataSource = {
  readonly page: (session: Session, type: MediaType, page: number) => Promise<PageDto<MediaItemDto>>;
  readonly set: (session: Session, type: MediaType, id: number, saved: boolean) => Promise<void>;
};

const pageSchema = pageDtoSchema(mediaItemDtoSchema);

/** The v3 account watchlist, addressed by the signed-in session. */
export const makeAccountWatchlistRemoteDataSource = ({
  http,
}: {
  http: HttpClient;
}): AccountWatchlistRemoteDataSource => ({
  page: (session, type, page) =>
    remoteOutcome(async () =>
      pageSchema.parse(
        await http.get(`account/${session.accountId}/watchlist/${type === 'movie' ? 'movies' : 'tv'}`, {
          session_id: session.sessionId,
          sort_by: 'created_at.desc',
          page,
        }),
      ),
    ),
  set: (session, type, id, saved) =>
    remoteOutcome(async () => {
      await http.send(
        'POST',
        `account/${session.accountId}/watchlist`,
        { media_type: type, media_id: id, watchlist: saved },
        { session_id: session.sessionId },
      );
    }),
});
