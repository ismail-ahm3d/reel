import { readDeviceLocale } from '@shared/core/data/locale/deviceLocale';
import { makeDeviceStorage } from '@shared/core/data/storage/deviceStorage';
import type { AppDependencies } from '@shell/presentation/dependencies';
import { makeAppDependencies } from '@shell/app/composition';
import { applyTheme, directionMatches, restartApp, setDirection } from '@shell/app/appearance';
import type { AppSettings } from '@features/settings/domain/model/appSettings';
import { makeSettings } from '@features/settings/composition';

export type BootResult = {
  readonly dependencies: AppDependencies;
  readonly settings: AppSettings;
};

/**
 * Runs once before the first frame: reads the saved settings synchronously, paints the theme, makes
 * sure the layout direction matches the language, then wires the app for that language.
 */
export const bootApp = (): BootResult => {
  const locale = readDeviceLocale();
  const storage = makeDeviceStorage();
  const settingsUseCases = makeSettings({ storage, deviceLanguageCode: locale.languageCode });
  const settings = settingsUseCases.getStartupSettings();

  applyTheme(settings.theme);
  if (!directionMatches(settings.language)) {
    setDirection(settings.language);
    restartApp(); // a release build picks the direction up on its next start
  }

  return {
    settings,
    dependencies: makeAppDependencies({
      storage,
      locale,
      language: settings.language,
      settings: settingsUseCases,
    }),
  };
};
