/** Root of every failure the app raises on purpose. The only error type that crosses a layer. */
export abstract class AppError extends Error {
  protected constructor(
    message: string,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype); // keeps instanceof working if classes are transpiled
  }
}

export type NetworkFailure =
  | { readonly kind: 'unreachable' }
  | { readonly kind: 'timeout' }
  | { readonly kind: 'unauthorized' }
  | { readonly kind: 'notFound'; readonly url: string }
  | { readonly kind: 'rateLimited' }
  | { readonly kind: 'server'; readonly status: number };

export class NetworkError extends AppError {
  constructor(
    readonly failure: NetworkFailure,
    cause?: unknown,
  ) {
    super(`network: ${failure.kind}`, cause);
  }
}

export type StorageFailure =
  { readonly kind: 'full' } | { readonly kind: 'corrupt' } | { readonly kind: 'unavailable' };

export class StorageError extends AppError {
  constructor(
    readonly failure: StorageFailure,
    cause?: unknown,
  ) {
    super(`storage: ${failure.kind}`, cause);
  }
}

/** A domain absence a use case treats as failure. Thrown by use cases, never by data. */
export class NotFoundError extends AppError {
  constructor(readonly id: string) {
    super(`not found: ${id}`);
  }
}

/** The wrappers' catch-all. Always reported, never silent. */
export class UnknownError extends AppError {
  constructor(cause: unknown) {
    super('unknown', cause);
  }
}
