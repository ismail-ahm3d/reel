import type { SettingsRepository } from '@features/settings/domain/repositories/settingsRepository';
import type { SettingsStorageDataSource } from '@features/settings/data/datasources/storage/settingsStorageDataSource';

/** The record and the model have the same shape today; the mapping is the identity. */
export const makeSettingsRepository = ({
  local,
}: {
  local: SettingsStorageDataSource;
}): SettingsRepository => ({
  read: () => local.read(),
  readNow: () => local.readSync(),
  save: (settings) => local.write({ language: settings.language, theme: settings.theme }),
});
