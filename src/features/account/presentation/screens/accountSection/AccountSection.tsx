import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { AccountAvatar } from '@features/account/presentation/components/AccountAvatar';
import { accountErrorText } from '@features/account/presentation/mappers/accountErrorText';
import {
  useAccountSection,
  type AccountSectionProps,
} from '@features/account/presentation/screens/accountSection/useAccountSection';

/** Sign in, or who is signed in and sign out, drawn like a Settings group. */
export const AccountSection = (props: AccountSectionProps) => {
  const view = useAccountSection(props);
  const t = useTranslate();
  if (view.isLoading) return null;
  const { account, signIn } = view;
  return (
    <View style={styles.group}>
      <View style={styles.caption}>
        <AppText role="label" scale="large" color="onSurfaceVariant" accessibilityRole="header">
          {t({ key: 'account.title' }).toUpperCase()}
        </AppText>
      </View>
      {signIn.error !== null && (
        <AppErrorBanner text={accountErrorText(signIn.error)} onDismiss={signIn.dismissError} />
      )}
      <View style={styles.card}>
        {account === null ? (
          <AppPressable
            onPress={signIn.signIn}
            accessibilityLabel={t({ key: 'account.signIn' })}
            disabled={signIn.isSigningIn}
          >
            <View style={styles.row}>
              <AppText role="body" scale="large" color="primary">
                {t({ key: signIn.isSigningIn ? 'account.signingIn' : 'account.signIn' })}
              </AppText>
            </View>
          </AppPressable>
        ) : (
          <>
            <View style={styles.row}>
              <AccountAvatar account={account} size="small" />
              <View style={styles.text}>
                <AppText role="body" scale="large" numberOfLines={1}>
                  {account.name ?? account.username}
                </AppText>
                <AppText role="label" scale="large" color="onSurfaceVariant">
                  {t({ key: 'account.tmdbUser', params: { username: account.username } })}
                </AppText>
              </View>
            </View>
            <View style={styles.separator} />
            <AppPressable
              onPress={signIn.signOut}
              accessibilityLabel={t({ key: 'account.signOut' })}
              disabled={signIn.isSigningOut}
            >
              <View style={styles.row}>
                <AppText role="body" scale="large" color="error">
                  {t({ key: 'account.signOut' })}
                </AppText>
              </View>
            </AppPressable>
          </>
        )}
      </View>
      <View style={styles.caption}>
        <AppText role="label" scale="large" color="onSurfaceVariant">
          {t({ key: account === null ? 'account.signInFooter' : 'account.signedInFooter' })}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  group: {
    gap: theme.spacing.s,
  },
  caption: {
    paddingHorizontal: theme.spacing.l,
  },
  card: {
    borderRadius: theme.shape.m,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  separator: {
    height: theme.border.hairline,
    marginStart: theme.spacing.l,
    backgroundColor: theme.colors.outline,
  },
}));
