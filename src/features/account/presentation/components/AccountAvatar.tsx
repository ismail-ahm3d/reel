import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { Account } from '@features/account/domain/model/account';

export type AccountAvatarProps = {
  readonly account: Account;
  readonly size: 'small' | 'large';
};

/** The user's picture, or their initial on the accent colour. */
export const AccountAvatar = ({ account, size }: AccountAvatarProps) => {
  styles.useVariants({ size });
  const initial = (account.name ?? account.username).slice(0, 1).toUpperCase();
  return (
    <View style={styles.avatar}>
      {account.avatar === null ? (
        <AppText role={size === 'large' ? 'headline' : 'title'} scale="medium" color="onPrimary">
          {initial}
        </AppText>
      ) : (
        <AppImage uri={account.avatar} shape="full" fill />
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: theme.shape.full,
    backgroundColor: theme.colors.primary,
    variants: {
      size: {
        small: { width: theme.spacing.xxxl - theme.spacing.s, height: theme.spacing.xxxl - theme.spacing.s },
        large: { width: theme.spacing.xxxl + theme.spacing.l, height: theme.spacing.xxxl + theme.spacing.l },
      },
    },
  },
}));
