import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { ErrorText } from '@shared/core/presentation/mappers/errorText';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppText } from '@shared/core/presentation/components/AppText';

export type AppErrorViewProps = {
  readonly text: ErrorText;
  readonly onRetry: () => void;
};

/** A failure that replaces the content until the user retries. */
export const AppErrorView = ({ text, onRetry }: AppErrorViewProps) => {
  const t = useTranslate();
  return (
    <View style={styles.container} accessibilityRole="alert">
      <AppIcon
        name={{ ios: 'exclamationmark.triangle', android: 'warning' }}
        size="xl"
        color="onSurfaceVariant"
      />
      <AppText role="headline" scale="small" style={{ textAlign: 'center' }}>
        {t({ key: 'error.title' })}
      </AppText>
      <AppText role="body" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
        {t(text)}
      </AppText>
      <AppButton label={t({ key: 'common.retry' })} onPress={onRetry} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.s,
    padding: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
  },
}));
