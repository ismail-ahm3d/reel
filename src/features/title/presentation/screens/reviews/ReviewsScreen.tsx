import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppEmptyState } from '@shared/core/presentation/components/AppEmptyState';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { ReviewCard } from '@features/title/presentation/components/ReviewCard';
import {
  useReviewsScreen,
  type ReviewsScreenProps,
} from '@features/title/presentation/screens/reviews/useReviewsScreen';

export const ReviewsScreen = (props: ReviewsScreenProps) => {
  const view = useReviewsScreen(props);
  const t = useTranslate();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.isLoading) return <AppLoading />;

  return (
    <FlatList
      data={view.reviews}
      keyExtractor={(review) => review.id}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={styles.content}
      onEndReached={view.loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={view.isLoadingMore ? <AppLoading variant="inline" /> : null}
      ListEmptyComponent={
        <AppEmptyState
          icon={{ ios: 'text.bubble', android: 'rate_review' }}
          title={t({ key: 'title.noReviewsTitle' })}
          message={t({ key: 'title.noReviewsMessage' })}
        />
      }
      renderItem={({ item }) => (
        <AppPressable
          onPress={() => {
            view.openReview(item);
          }}
          accessibilityLabel={item.author}
          accessibilityHint={t({ key: 'title.openReview' })}
        >
          <ReviewCard review={item} variant="full" />
        </AppPressable>
      )}
    />
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.l,
    gap: theme.spacing.m,
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
    flexGrow: 1,
  },
}));
