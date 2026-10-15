import type { Session } from '@shared/domain/model/session';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';

export const aSession: Session = {
  accessToken: 'token',
  accountObjectId: 'object',
  sessionId: 'session',
  accountId: 7,
};

export const makeFakeSessionRepository = (initial: Session | null = null) => {
  let session = initial;
  const repository: SessionRepository = {
    current: async () => session,
    save: async (next) => {
      session = next;
    },
    clear: async () => {
      session = null;
    },
  };
  return { repository, current: () => session };
};
