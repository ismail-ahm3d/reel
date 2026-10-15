import { outcome, type Outcome } from '@shared/core/domain/outcome';
import { defaultSettings, type AppSettings } from '@features/settings/domain/model/appSettings';
import type { SettingsRepository } from '@features/settings/domain/repositories/settingsRepository';

export type GetSettings = () => Promise<Outcome<AppSettings>>;

export const makeGetSettings =
  ({
    settings,
    deviceLanguageCode,
  }: {
    settings: SettingsRepository;
    deviceLanguageCode: string;
  }): GetSettings =>
  () =>
    outcome(async () => (await settings.read()) ?? defaultSettings(deviceLanguageCode));
