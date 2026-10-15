import type { ReactElement } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';
import { PosterCard } from '@shared/presentation/components/PosterCard';

export type MediaGridProps = {
  readonly items: readonly MediaSummary[];
  readonly onSelect: (media: MediaSummary) => void;
  readonly onEndReached?: () => void;
  readonly isLoadingMore?: boolean;
  readonly header?: ReactElement | undefined;
  readonly empty?: ReactElement;
  /** Shown after the last row, such as related titles. */
  readonly footer?: ReactElement | undefined;
  readonly isRefreshing?: boolean;
  readonly onRefresh?: () => void;
  readonly captionFor?: (media: MediaSummary) => string | undefined;
  readonly onLongPress?: (media: MediaSummary) => void;
  /** Given while picking titles: every card shows whether it is picked. */
  readonly isSelected?: (media: MediaSummary) => boolean;
  /** Room kept below the last row, for a bar floating over the grid. */
  readonly bottomSpace?: number;
};

/** Phones show three posters a row, tablets more; widths come from the window and the theme's gutters. */
export const MediaGrid = ({
  items,
  onSelect,
  onEndReached,
  isLoadingMore = false,
  header,
  empty,
  isRefreshing,
  onRefresh,
  captionFor,
  onLongPress,
  isSelected,
  bottomSpace = 0,
  footer,
}: MediaGridProps) => {
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 6 : width >= 600 ? 4 : 3;
  const gutter = theme.spacing.l;
  const gap = theme.spacing.m;
  const cardWidth = Math.floor((width - gutter * 2 - gap * (columns - 1)) / columns);
  return (
    <FlatList
      key={columns}
      data={items}
      numColumns={columns}
      keyExtractor={(item) => mediaRefKey(item.ref)}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content(bottomSpace)}
      extraData={isSelected}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => {
        const caption = captionFor?.(item);
        return (
          <PosterCard
            media={item}
            onPress={onSelect}
            width={cardWidth}
            {...(caption === undefined ? {} : { caption })}
            {...(onLongPress === undefined ? {} : { onLongPress })}
            {...(isSelected === undefined ? {} : { selection: isSelected(item) ? 'selected' : 'unselected' })}
          />
        );
      }}
      onEndReachedThreshold={0.6}
      {...(onEndReached === undefined ? {} : { onEndReached })}
      {...(header === undefined ? {} : { ListHeaderComponent: header })}
      {...(empty === undefined ? {} : { ListEmptyComponent: empty })}
      {...(onRefresh === undefined ? {} : { onRefresh, refreshing: isRefreshing ?? false })}
      ListFooterComponent={
        isLoadingMore ? (
          <>
            <AppLoading variant="inline" />
            {footer}
          </>
        ) : (
          (footer ?? null)
        )
      }
    />
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  content: (bottomSpace: number) => ({
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.xxl + rt.insets.bottom + bottomSpace,
    gap: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  }),
  row: {
    gap: theme.spacing.m,
  },
}));
