import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppText } from '@shared/core/presentation/components/AppText';
import { formatRating } from '@shared/presentation/mappers/mediaText';

export type RatingBadgeProps = {
  readonly rating: number;
  /** onImage sits over artwork; plain sits on the background. */
  readonly variant?: 'plain' | 'onImage';
};

export const RatingBadge = ({ rating, variant = 'plain' }: RatingBadgeProps) => {
  styles.useVariants({ variant });
  return (
    <View style={styles.badge}>
      <AppIcon name={{ ios: 'star.fill', android: 'star' }} size="s" color="warning" />
      <AppText role="label" scale="large" color={variant === 'onImage' ? 'onScrim' : 'onSurfaceVariant'}>
        {formatRating(rating)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
    variants: {
      variant: {
        plain: {},
        onImage: {
          backgroundColor: theme.colors.scrim,
          paddingHorizontal: theme.spacing.s,
          paddingVertical: theme.spacing.xxs,
          borderRadius: theme.shape.full,
        },
      },
    },
  },
}));
