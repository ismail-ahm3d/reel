import type { KeyValueStorage } from '@shared/core/data/storage/keyValueStorage';
import type { SettingsUseCases } from '@features/settings/domain/usecases/settingsUseCases';
import { makeGetSettings } from '@features/settings/domain/usecases/getSettings';
import { makeGetStartupSettings } from '@features/settings/domain/usecases/getStartupSettings';
import { makeUpdateSettings } from '@features/settings/domain/usecases/updateSettings';
import { makeSettingsStorageDataSource } from '@features/settings/data/datasources/storage/settingsStorageDataSource';
import { makeSettingsRepository } from '@features/settings/data/repositories/settingsRepositoryImpl';

export const makeSettings = ({
  storage,
  deviceLanguageCode,
}: {
  storage: KeyValueStorage;
  deviceLanguageCode: string;
}): SettingsUseCases => {
  const settings = makeSettingsRepository({ local: makeSettingsStorageDataSource({ storage }) });
  return {
    getSettings: makeGetSettings({ settings, deviceLanguageCode }),
    getStartupSettings: makeGetStartupSettings({ settings, deviceLanguageCode }),
    updateSettings: makeUpdateSettings({ settings, deviceLanguageCode }),
  };
};
