import { AppError, StorageError, UnknownError } from '@shared/core/domain/appError';
import { isAbort } from '@shared/core/data/remoteOutcome';
import { report } from '@shared/core/data/report';

/** Runs a storage call, sync or async; anything the library throws leaves as an AppError. */
export const storageOutcome = async <T>(block: () => T | Promise<T>): Promise<T> => {
  try {
    return await block();
  } catch (error) {
    if (isAbort(error) || error instanceof AppError) throw error;
    throw toStorageError(error);
  }
};

/** storageOutcome() for a synchronous read, such as settings needed before the first frame. */
export const storageOutcomeSync = <T>(block: () => T): T => {
  try {
    return block();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw toStorageError(error);
  }
};

/** expo-sqlite raises SQLite's own codes in its messages. */
const toStorageError = (error: unknown): AppError => {
  const message = error instanceof Error ? error.message : '';
  if (/no space|disk full|SQLITE_FULL/i.test(message)) return new StorageError({ kind: 'full' }, error);
  if (/corrupt|malformed|SQLITE_CORRUPT|SQLITE_NOTADB/i.test(message))
    return new StorageError({ kind: 'corrupt' }, error);
  if (/SQLITE_CANTOPEN|SQLITE_IOERR/i.test(message)) return new StorageError({ kind: 'unavailable' }, error);
  const unknown = new UnknownError(error);
  report(unknown);
  return unknown;
};
