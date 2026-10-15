import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';

export type AppLoadingProps = {
  /** fill takes the whole screen; inline sits in a list footer. */
  readonly variant?: 'fill' | 'inline';
};

export const AppLoading = ({ variant = 'fill' }: AppLoadingProps) => {
  const { theme } = useUnistyles();
  const t = useTranslate();
  styles.useVariants({ variant });
  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={theme.colors.onSurfaceVariant}
        accessibilityLabel={t({ key: 'common.loading' })}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      variant: {
        fill: { flex: 1, backgroundColor: theme.colors.background },
        inline: { paddingVertical: theme.spacing.xl },
      },
    },
  },
}));
