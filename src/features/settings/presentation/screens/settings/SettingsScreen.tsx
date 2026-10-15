import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { languages, themePreferences, type Language } from '@features/settings/domain/model/appSettings';
import { SettingsGroup } from '@features/settings/presentation/screens/settings/components/SettingsGroup';
import { SettingsRow } from '@features/settings/presentation/screens/settings/components/SettingsRow';
import {
  useSettingsScreen,
  type SettingsScreenProps,
} from '@features/settings/presentation/screens/settings/useSettingsScreen';

/** Each language is named in itself, so it can be found whatever the current language is. */
const languageNames: Readonly<Record<Language, string>> = { en: 'English', ar: 'العربية' };

/** The account block at the top, filled by the route. */
export type SettingsSlots = {
  readonly accountSection?: ReactNode;
};

export const SettingsScreen = ({ accountSection, ...props }: SettingsScreenProps & SettingsSlots) => {
  const view = useSettingsScreen(props);
  const t = useTranslate();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.settings === null) return <AppLoading />;

  const { settings } = view;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      {view.actionError !== null && (
        <AppErrorBanner text={errorText(view.actionError)} onDismiss={view.dismissActionError} />
      )}
      {view.needsRestart && (
        <AppText role="body" scale="medium" color="primary" style={{ textAlign: 'center' }}>
          {t({ key: 'settings.restartNote' })}
        </AppText>
      )}
      {accountSection}
      <SettingsGroup title={t({ key: 'settings.language' })} footer={t({ key: 'settings.languageFooter' })}>
        {languages.map((language) => (
          <SettingsRow
            key={language}
            label={languageNames[language]}
            selected={settings.language === language}
            onPress={() => {
              view.selectLanguage(language);
            }}
          />
        ))}
      </SettingsGroup>
      <SettingsGroup title={t({ key: 'settings.appearance' })} footer={t({ key: 'settings.themeFooter' })}>
        {themePreferences.map((theme) => (
          <SettingsRow
            key={theme}
            label={t({ key: `settings.theme.${theme}` })}
            selected={settings.theme === theme}
            onPress={() => {
              view.selectTheme(theme);
            }}
          />
        ))}
      </SettingsGroup>
      <SettingsGroup title={t({ key: 'settings.about' })} footer={t({ key: 'settings.attribution' })}>
        {[<SettingsRow key="version" label={t({ key: 'settings.version' })} value={view.appVersion} />]}
      </SettingsGroup>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.l,
    gap: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
  },
}));
