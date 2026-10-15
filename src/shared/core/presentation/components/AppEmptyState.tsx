import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon, type IconName } from '@shared/core/presentation/components/AppIcon';
import { AppText } from '@shared/core/presentation/components/AppText';

export type AppEmptyStateProps = {
  readonly icon: IconName;
  readonly title: string;
  readonly message: string;
};

/** Nothing to show yet, said the way the system says it: a symbol, a title, one line. */
export const AppEmptyState = ({ icon, title, message }: AppEmptyStateProps) => (
  <View style={styles.container}>
    <AppIcon name={icon} size="xl" color="onSurfaceVariant" />
    <AppText role="headline" scale="medium" style={{ textAlign: 'center' }}>
      {title}
    </AppText>
    <AppText role="body" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
      {message}
    </AppText>
  </View>
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.xxxl,
  },
}));
