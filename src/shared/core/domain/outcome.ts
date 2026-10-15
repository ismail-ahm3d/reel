import { AppError } from '@shared/core/domain/appError';

export type Outcome<T> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: AppError };

/** Catches AppError only; bugs propagate. Used in use cases, nowhere else. */
export const outcome = async <T>(block: () => Promise<T>): Promise<Outcome<T>> => {
  try {
    return { ok: true, value: await block() };
  } catch (error) {
    if (error instanceof AppError) return { ok: false, error };
    throw error;
  }
};

/** Unwraps an Outcome, rethrowing its AppError. Query functions and composing use cases only. */
export const getOrThrow = <T>(result: Outcome<T>): T => {
  if (result.ok) return result.value;
  throw result.error;
};

/** outcome() for a synchronous block, such as a read the app needs before its first frame. */
export const outcomeSync = <T>(block: () => T): Outcome<T> => {
  try {
    return { ok: true, value: block() };
  } catch (error) {
    if (error instanceof AppError) return { ok: false, error };
    throw error;
  }
};
