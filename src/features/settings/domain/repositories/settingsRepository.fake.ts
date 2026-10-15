import type { AppError } from '@shared/core/domain/appError';
import type { AppSettings } from '@features/settings/domain/model/appSettings';
import type { SettingsRepository } from '@features/settings/domain/repositories/settingsRepository';

export const makeFakeSettingsRepository = (initial: AppSettings | null = null) => {
  let stored = initial;
  let failure: AppError | null = null;
  const guard = () => {
    if (failure !== null) throw failure;
  };
  const repository: SettingsRepository = {
    read: async () => {
      guard();
      return stored;
    },
    readNow: () => {
      guard();
      return stored;
    },
    save: async (settings) => {
      guard();
      stored = settings;
    },
  };
  return {
    repository,
    failWith: (error: AppError | null) => {
      failure = error;
    },
    stored: () => stored,
  };
};
