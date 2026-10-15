import type { Session } from '@shared/domain/model/session';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import { AccountError } from '@features/account/domain/model/accountError';

/** The current session, or the signed-out failure every account action shares. */
export const requireSession = async (sessions: SessionRepository): Promise<Session> => {
  const session = await sessions.current();
  if (session === null) throw new AccountError({ kind: 'signedOut' });
  return session;
};
