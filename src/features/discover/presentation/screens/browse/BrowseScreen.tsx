import { View } from 'react-native';
import { GridSkeleton } from '@shared/presentation/components/Skeletons';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import { AppEmptyState } from '@shared/core/presentation/components/AppEmptyState';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { MediaGrid } from '@shared/presentation/components/MediaGrid';
import { formatCount } from '@shared/presentation/mappers/mediaText';
import { sortKey } from '@features/discover/presentation/mappers/discoverText';
import { FilterSheet } from '@features/discover/presentation/screens/browse/components/FilterSheet';
import {
  useBrowseScreen,
  type BrowseScreenProps,
} from '@features/discover/presentation/screens/browse/useBrowseScreen';

export const BrowseScreen = (props: BrowseScreenProps) => {
  const view = useBrowseScreen(props);
  const t = useTranslate();
  const locale = useLocale();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.isLoading) return <GridSkeleton />;

  const filterLabel =
    view.activeFilterCount === 0
      ? t({ key: 'discover.filters' })
      : t({ key: 'discover.filtersCount', params: { count: view.activeFilterCount } });

  return (
    <>
      <MediaGrid
        items={view.items}
        onSelect={view.openMedia}
        onEndReached={view.loadMore}
        isLoadingMore={view.isLoadingMore}
        header={
          <View style={styles.header}>
            <View style={styles.chips}>
              <AppChip
                label={filterLabel}
                icon={{ ios: 'line.3.horizontal.decrease', android: 'filter_list' }}
                selected={view.activeFilterCount > 0}
                onPress={view.openFilters}
              />
              <AppChip
                label={t({ key: sortKey(view.filters.sort) })}
                icon={{ ios: 'arrow.up.arrow.down', android: 'swap_vert' }}
                onPress={view.openFilters}
              />
            </View>
            {view.totalResults !== null && (
              <AppText role="label" scale="large" color="onSurfaceVariant">
                {t({
                  key: 'discover.resultCount',
                  params: { count: formatCount(view.totalResults, locale) },
                })}
              </AppText>
            )}
          </View>
        }
        empty={
          <AppEmptyState
            icon={{ ios: 'film.stack', android: 'movie' }}
            title={t({ key: 'discover.noResultsTitle' })}
            message={t({ key: 'discover.noResultsMessage' })}
          />
        }
      />
      <FilterSheet
        visible={view.isFilterSheetOpen}
        type={view.type}
        filters={view.filters}
        sortOrders={view.sortOrders}
        genres={view.genres}
        services={view.services}
        onClose={view.closeFilters}
        onReset={view.resetFilters}
        onSort={view.setSort}
        onToggleGenre={view.toggleGenre}
        onToggleService={view.toggleService}
        onDecade={view.setDecade}
        onMinRating={view.setMinRating}
        onLanguage={view.setLanguage}
        onRuntime={view.setRuntime}
      />
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    gap: theme.spacing.s,
  },
  chips: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
}));
