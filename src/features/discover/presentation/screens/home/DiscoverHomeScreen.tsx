import { RefreshControl, ScrollView } from 'react-native';
import { HomeSkeleton } from '@features/discover/presentation/screens/home/components/HomeSkeleton';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppSegmented } from '@shared/core/presentation/components/AppSegmented';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { MediaRail } from '@shared/presentation/components/MediaRail';
import { categoryTitleKey } from '@features/discover/presentation/mappers/discoverText';
import { FeaturedCarousel } from '@features/discover/presentation/screens/home/components/FeaturedCarousel';
import { GenreStrip } from '@features/discover/presentation/screens/home/components/GenreStrip';
import {
  useDiscoverHomeScreen,
  type DiscoverHomeScreenProps,
} from '@features/discover/presentation/screens/home/useDiscoverHomeScreen';

export const DiscoverHomeScreen = (props: DiscoverHomeScreenProps) => {
  const view = useDiscoverHomeScreen(props);
  const t = useTranslate();
  const { theme } = useUnistyles();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.isLoading) return <HomeSkeleton />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={view.isRefreshing}
          onRefresh={view.refresh}
          tintColor={theme.colors.onSurfaceVariant}
        />
      }
    >
      <FeaturedCarousel items={view.featured} onSelect={view.openMedia} />
      <GenreStrip
        genres={view.genres}
        allLabel={t({ key: 'discover.browseAll' })}
        onSelect={view.browseGenre}
        onSelectAll={view.browseAll}
      />
      {view.rails.map((rail) => (
        <MediaRail
          key={rail.category}
          title={t({ key: categoryTitleKey(view.type, rail.category) })}
          items={rail.items}
          onSelect={view.openMedia}
          onSeeAll={() => {
            view.openCategory(rail.category);
          }}
          variant={rail.category === 'trending' || rail.category === 'trendingToday' ? 'backdrop' : 'poster'}
          {...(rail.category === 'trending' || rail.category === 'trendingToday'
            ? {
                accessory: (
                  <AppSegmented
                    segments={[
                      { value: 'day', label: t({ key: 'discover.today' }) },
                      { value: 'week', label: t({ key: 'discover.thisWeek' }) },
                    ]}
                    selected={view.trendingPeriod}
                    onSelect={view.setTrendingPeriod}
                  />
                ),
              }
            : {})}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
  },
}));
