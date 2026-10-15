import { AppError, NetworkError, UnknownError } from '@shared/core/domain/appError';
import { HttpStatusError, HttpTimeoutError } from '@shared/core/data/http/httpClient';
import { report } from '@shared/core/data/report';

/** A caller's own cancellation. Passes through every wrapper untouched. */
export const isAbort = (error: unknown): boolean => error instanceof Error && error.name === 'AbortError';

/** Runs a remote call; anything the client or the parser throws leaves as an AppError. */
export const remoteOutcome = async <T>(block: () => Promise<T>): Promise<T> => {
  try {
    return await block();
  } catch (error) {
    if (isAbort(error) || error instanceof AppError) throw error;
    throw toNetworkError(error);
  }
};

const toNetworkError = (error: unknown): AppError => {
  if (error instanceof HttpTimeoutError) return new NetworkError({ kind: 'timeout' }, error);
  if (error instanceof HttpStatusError) {
    if (error.status === 401 || error.status === 403)
      return new NetworkError({ kind: 'unauthorized' }, error);
    if (error.status === 404) return new NetworkError({ kind: 'notFound', url: error.url }, error);
    if (error.status === 429) return new NetworkError({ kind: 'rateLimited' }, error);
    if (error.status >= 500) return new NetworkError({ kind: 'server', status: error.status }, error);
  }
  if (error instanceof TypeError) return new NetworkError({ kind: 'unreachable' }, error); // fetch's "Network request failed"
  const unknown = new UnknownError(error); // a parse failure lands here: the server broke the contract
  report(unknown);
  return unknown;
};
