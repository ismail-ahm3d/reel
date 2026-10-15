import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { SessionSecureDataSource } from '@shared/data/datasources/secure/sessionSecureDataSource';

/** The record and the model have the same shape; the mapping is the identity. */
export const makeSessionRepository = ({ local }: { local: SessionSecureDataSource }): SessionRepository => ({
  current: () => local.read(),
  save: (session) => local.write(session),
  clear: () => local.remove(),
});
