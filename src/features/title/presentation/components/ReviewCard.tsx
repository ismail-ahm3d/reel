import { useLocale } from '@shared/core/presentation/i18n/useTranslate';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppText } from '@shared/core/presentation/components/AppText';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';
import { formatDate } from '@shared/presentation/mappers/mediaText';
import type { Review } from '@features/title/domain/model/titleDetails';

export type ReviewCardProps = {
  readonly review: Review;
  /** clamped shows an excerpt for rails; full shows everything for the reviews list. */
  readonly variant: 'clamped' | 'full';
};

/** TMDB reviews come as loosely formatted markdown; the emphasis markers are noise in plain text. */
const plain = (content: string): string => content.replace(/\*\*|__|\r/g, '').replace(/\n{3,}/g, '\n\n');

export const ReviewCard = ({ review, variant }: ReviewCardProps) => {
  const locale = useLocale();
  styles.useVariants({ variant });
  const date = formatDate(review.createdAt?.slice(0, 10) ?? null, locale);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <AppImage uri={review.avatar} shape="full" style={{ width: 36, height: 36 }} />
          {review.avatar === null && (
            <View style={styles.placeholder}>
              <AppIcon name={{ ios: 'person.fill', android: 'person' }} size="s" color="onSurfaceVariant" />
            </View>
          )}
        </View>
        <View style={styles.byline}>
          <AppText role="title" scale="medium" numberOfLines={1}>
            {review.author}
          </AppText>
          {date !== null && (
            <AppText role="label" scale="medium" color="onSurfaceVariant">
              {date}
            </AppText>
          )}
        </View>
        {review.rating !== null && <RatingBadge rating={review.rating} />}
      </View>
      <AppText
        role="body"
        scale="medium"
        {...(variant === 'clamped' ? { numberOfLines: 6 } : {})}
        selectable={variant === 'full'}
      >
        {plain(review.content)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.spacing.m,
    padding: theme.spacing.l,
    borderRadius: theme.shape.l,
    backgroundColor: theme.colors.surface,
    variants: {
      variant: {
        clamped: { width: 300, height: 230 },
        full: {},
      },
    },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  avatar: {
    width: 36,
    height: 36,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  byline: {
    flex: 1,
  },
}));
