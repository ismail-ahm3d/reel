import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import type { Review } from '@features/title/domain/model/titleDetails';
import { ReviewCard } from '@features/title/presentation/components/ReviewCard';

export type ReviewsRailProps = {
  readonly reviews: readonly Review[];
  readonly total: number;
  readonly onSeeAll: () => void;
};

export const ReviewsRail = ({ reviews, total, onSeeAll }: ReviewsRailProps) => {
  const t = useTranslate();
  if (reviews.length === 0) return null;
  return (
    <View>
      <SectionHeader title={t({ key: 'title.reviewsCount', params: { count: total } })} onSeeAll={onSeeAll} />
      <FlatList
        horizontal
        data={reviews.slice(0, 6)}
        keyExtractor={(review) => review.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => (
          <AppPressable onPress={onSeeAll} accessibilityLabel={item.author}>
            <ReviewCard review={item} variant="clamped" />
          </AppPressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  rail: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
}));
