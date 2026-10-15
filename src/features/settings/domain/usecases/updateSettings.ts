import { outcome, type Outcome } from '@shared/core/domain/outcome';
import { defaultSettings, type AppSettings } from '@features/settings/domain/model/appSettings';
import type { SettingsRepository } from '@features/settings/domain/repositories/settingsRepository';

/** Applies a change over the current settings and returns what is now saved. */
export type UpdateSettings = (change: Partial<AppSettings>) => Promise<Outcome<AppSettings>>;

export const makeUpdateSettings =
  ({
    settings,
    deviceLanguageCode,
  }: {
    settings: SettingsRepository;
    deviceLanguageCode: string;
  }): UpdateSettings =>
  (change) =>
    outcome(async () => {
      const next = { ...((await settings.read()) ?? defaultSettings(deviceLanguageCode)), ...change };
      await settings.save(next);
      return next;
    });
