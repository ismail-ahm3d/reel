import { ScrollView, View, useWindowDimensions } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AppSkeleton } from '@shared/core/presentation/components/AppSkeleton';
import { RailSkeleton } from '@shared/presentation/components/Skeletons';

/** The home page's shape while its lists load: carousel, genre capsules, rails. */
export const HomeSkeleton = () => {
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" scrollEnabled={false} style={styles.screen}>
      <View style={styles.carousel}>
        <AppSkeleton
          shape="xl"
          style={{ width: Math.min(width - theme.spacing.l * 2, 640), aspectRatio: 4 / 3 }}
        />
      </View>
      <View style={styles.chips}>
        {[96, 72, 104, 88].map((chipWidth) => (
          <AppSkeleton
            key={chipWidth}
            shape="full"
            style={{ width: chipWidth, height: theme.spacing.xxl + theme.spacing.xxs }}
          />
        ))}
      </View>
      <RailSkeleton />
      <RailSkeleton />
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  carousel: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.s,
  },
  chips: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xl,
  },
}));
