import { Stack } from 'expo-router';
import SettingsSymbol from '@expo/material-symbols/settings.xml';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { appNavigation } from '@shell/presentation/navigation';

/** The gear in the header of each tab's first screen, opening the Settings sheet. */
export const SettingsButton = () => {
  const t = useTranslate();
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Button
        icon={process.env.EXPO_OS === 'ios' ? 'gearshape' : SettingsSymbol}
        accessibilityLabel={t({ key: 'common.settings' })}
        onPress={appNavigation.openSettings}
      />
    </Stack.Toolbar>
  );
};
