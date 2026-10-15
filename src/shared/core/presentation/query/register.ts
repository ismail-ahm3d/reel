import type { AppError } from '@shared/core/domain/appError';

/** Types every query and mutation error as AppError: use cases are the only query functions. */
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AppError;
  }
}
