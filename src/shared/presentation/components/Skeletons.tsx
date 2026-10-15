import { ScrollView, View, useWindowDimensions } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AppSkeleton } from '@shared/core/presentation/components/AppSkeleton';

/** Rows of poster-shaped placeholders, as many columns as the grid will have. */
export const GridSkeleton = () => {
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 6 : width >= 600 ? 4 : 3;
  const cardWidth = Math.floor((width - theme.spacing.l * 2 - theme.spacing.m * (columns - 1)) / columns);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      scrollEnabled={false}
      style={styles.screen}
      contentContainerStyle={styles.grid}
    >
      {Array.from({ length: columns * 4 }, (_, index) => (
        <View key={index} style={{ width: cardWidth }}>
          <AppSkeleton style={{ aspectRatio: 2 / 3 }} />
          <AppSkeleton
            shape="xs"
            style={{ height: theme.spacing.m, width: '80%', marginTop: theme.spacing.s }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

/** A titled row of poster placeholders. */
export const RailSkeleton = () => {
  const { theme } = useUnistyles();
  return (
    <View style={styles.rail}>
      <AppSkeleton shape="xs" style={{ height: theme.spacing.xl, width: '45%' }} />
      <View style={styles.row}>
        {Array.from({ length: 4 }, (_, index) => (
          <AppSkeleton key={index} style={{ width: 116, aspectRatio: 2 / 3 }} />
        ))}
      </View>
    </View>
  );
};

/** A tall artwork block, a title and lines of text: the shape of a details page. */
export const DetailsSkeleton = () => {
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  return (
    <ScrollView contentInsetAdjustmentBehavior="never" scrollEnabled={false} style={styles.screen}>
      <AppSkeleton shape="none" style={{ height: Math.min(width * 1.05, 620) }} />
      <View style={styles.details}>
        <View style={styles.row}>
          <AppSkeleton shape="l" style={{ flex: 1, height: theme.spacing.xxxl }} />
          <AppSkeleton shape="l" style={{ flex: 1, height: theme.spacing.xxxl }} />
        </View>
        {[100, 92, 96, 60].map((percent) => (
          <AppSkeleton key={percent} shape="xs" style={{ height: theme.spacing.l, width: `${percent}%` }} />
        ))}
      </View>
      <RailSkeleton />
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.m,
    rowGap: theme.spacing.xl,
    padding: theme.spacing.l,
  },
  rail: {
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.l,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  details: {
    gap: theme.spacing.m,
    padding: theme.spacing.l,
  },
}));
