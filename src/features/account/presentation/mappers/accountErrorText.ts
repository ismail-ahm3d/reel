import type { AppError } from '@shared/core/domain/appError';
import { errorText, type ErrorText } from '@shared/core/presentation/mappers/errorText';
import { AccountError } from '@features/account/domain/model/accountError';

export const accountErrorText = (error: AppError): ErrorText => {
  if (error instanceof AccountError) {
    switch (error.failure.kind) {
      case 'signedOut':
        return { key: 'error.account.signedOut' };
      case 'notApproved':
        return { key: 'error.account.notApproved' };
      case 'invalidRating':
        return { key: 'error.account.invalidRating' };
      case 'invalidListName':
        return { key: 'error.account.invalidListName' };
    }
  }
  return errorText(error);
};

/** True when the user closed TMDB's approval page: their choice, not a failure to report. */
export const isDeclinedSignIn = (error: AppError): boolean =>
  error instanceof AccountError && error.failure.kind === 'notApproved';
