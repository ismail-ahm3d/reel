import { AppError } from '@shared/core/domain/appError';

export type AccountFailure =
  /** The action needs a TMDB account and nobody is signed in. */
  | { readonly kind: 'signedOut' }
  /** The user closed the TMDB approval page or declined. */
  | { readonly kind: 'notApproved' }
  | { readonly kind: 'invalidRating' }
  | { readonly kind: 'invalidListName' };

/** Failures only the account has. */
export class AccountError extends AppError {
  constructor(
    readonly failure: AccountFailure,
    cause?: unknown,
  ) {
    super(`account: ${failure.kind}`, cause);
  }
}
