import { NetworkError, NotFoundError, StorageError, UnknownError } from '@shared/core/domain/appError';
import type { AppError } from '@shared/core/domain/appError';

/** A translation key plus its parameters. Produced by mappers, translated by screens. */
export type ErrorText = {
  readonly key: `error.${string}`;
  readonly params?: Readonly<Record<string, string | number>>;
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
};

export const errorText = (error: AppError): ErrorText => {
  if (error instanceof NetworkError) {
    const failure = error.failure;
    switch (failure.kind) {
      case 'unreachable':
        return { key: 'error.unreachable' };
      case 'timeout':
        return { key: 'error.timeout' };
      case 'unauthorized':
        return { key: 'error.unauthorized' };
      case 'notFound':
        return { key: 'error.notFound' };
      case 'rateLimited':
        return { key: 'error.rateLimited' };
      case 'server':
        return { key: 'error.server', params: { status: failure.status } };
      default:
        return assertNever(failure);
    }
  }
  if (error instanceof StorageError) {
    switch (error.failure.kind) {
      case 'full':
        return { key: 'error.storageFull' };
      case 'corrupt':
        return { key: 'error.storageCorrupt' };
      case 'unavailable':
        return { key: 'error.storageUnavailable' };
      default:
        return assertNever(error.failure);
    }
  }
  if (error instanceof NotFoundError) return { key: 'error.notFound' };
  if (error instanceof UnknownError) return { key: 'error.unknown' };
  return { key: 'error.unknown' }; // a family this module does not know: the one honest fallback
};
