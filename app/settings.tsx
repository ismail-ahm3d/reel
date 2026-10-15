import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { applyLanguage, applyTheme } from '@shell/app/appearance';
import { SettingsScreen } from '@features/settings/presentation/screens/settings/SettingsScreen';
import { AccountSection } from '@features/account/presentation/screens/accountSection/AccountSection';

export default function SettingsRoute() {
  const { settings, account } = useDependencies();
  const t = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t({ key: 'settings.title' }) }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button variant="done" onPress={appNavigation.closeModal}>
          {t({ key: 'common.done' })}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <SettingsScreen
        useCases={settings}
        appVersion={Constants.expoConfig?.version ?? ''}
        onThemeChanged={applyTheme}
        onLanguageChanged={applyLanguage}
        accountSection={<AccountSection useCases={account} />}
      />
    </>
  );
}
