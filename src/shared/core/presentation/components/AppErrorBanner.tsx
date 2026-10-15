import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { ErrorText } from '@shared/core/presentation/mappers/errorText';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppText } from '@shared/core/presentation/components/AppText';

export type AppErrorBannerProps = {
  readonly text: ErrorText;
  readonly onDismiss: () => void;
};

/** A failure that interrupted one action while the screen stays usable. Pressing dismisses it. */
export const AppErrorBanner = ({ text, onDismiss }: AppErrorBannerProps) => {
  const t = useTranslate();
  return (
    <Pressable
      accessibilityRole="alert"
      accessibilityHint={t({ key: 'common.dismiss' })}
      onPress={onDismiss}
      style={styles.banner}
    >
      <AppText role="body" color="onError">
        {t(text)}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  banner: {
    marginHorizontal: theme.spacing.l,
    padding: theme.spacing.m,
    borderRadius: theme.shape.m,
    backgroundColor: theme.colors.error,
  },
}));
