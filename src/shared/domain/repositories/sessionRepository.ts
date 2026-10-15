import type { Session } from '@shared/domain/model/session';

/** Every function may throw AppError; nothing else. */
export type SessionRepository = {
  readonly current: () => Promise<Session | null>;
  readonly save: (session: Session) => Promise<void>;
  readonly clear: () => Promise<void>;
};
