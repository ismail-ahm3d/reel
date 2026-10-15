import type { GetSettings } from '@features/settings/domain/usecases/getSettings';
import type { GetStartupSettings } from '@features/settings/domain/usecases/getStartupSettings';
import type { UpdateSettings } from '@features/settings/domain/usecases/updateSettings';

export type SettingsUseCases = {
  readonly getSettings: GetSettings;
  readonly getStartupSettings: GetStartupSettings;
  readonly updateSettings: UpdateSettings;
};
