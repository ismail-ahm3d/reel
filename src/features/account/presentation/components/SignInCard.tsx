import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppText } from '@shared/core/presentation/components/AppText';

export type SignInCardProps = {
  readonly onSignIn: () => void;
  readonly isSigningIn: boolean;
};

/** What signing in unlocks, and the one button that does it. */
export const SignInCard = ({ onSignIn, isSigningIn }: SignInCardProps) => {
  const t = useTranslate();
  return (
    <View style={styles.card}>
      <AppIcon
        name={{ ios: 'person.crop.circle.badge.plus', android: 'person_add' }}
        size="xl"
        color="primary"
      />
      <AppText role="headline" scale="small" style={{ textAlign: 'center' }}>
        {t({ key: 'account.signInTitle' })}
      </AppText>
      <AppText role="body" scale="medium" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
        {t({ key: 'account.signInMessage' })}
      </AppText>
      <AppButton
        label={t({ key: isSigningIn ? 'account.signingIn' : 'account.signIn' })}
        onPress={onSignIn}
        disabled={isSigningIn}
        style={{ alignSelf: 'stretch' }}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: 'center',
    gap: theme.spacing.s,
    padding: theme.spacing.xl,
    borderRadius: theme.shape.xl,
    backgroundColor: theme.colors.surface,
  },
}));
