import { outcomeSync } from '@shared/core/domain/outcome';
import { defaultSettings, type AppSettings } from '@features/settings/domain/model/appSettings';
import type { SettingsRepository } from '@features/settings/domain/repositories/settingsRepository';

/** Never fails: unreadable settings start the app with the defaults rather than not at all. */
export type GetStartupSettings = () => AppSettings;

export const makeGetStartupSettings =
  ({
    settings,
    deviceLanguageCode,
  }: {
    settings: SettingsRepository;
    deviceLanguageCode: string;
  }): GetStartupSettings =>
  () => {
    const result = outcomeSync(() => settings.readNow());
    return (result.ok ? result.value : null) ?? defaultSettings(deviceLanguageCode);
  };
