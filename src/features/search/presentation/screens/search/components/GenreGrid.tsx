import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { Genre } from '@shared/domain/model/genre';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type GenreGridProps = {
  readonly title: string;
  readonly allLabel: string;
  readonly genres: readonly Genre[];
  readonly onSelect: (genre: Genre) => void;
  readonly onSelectAll: () => void;
};

/** Two columns of genre tiles, like the system's browse categories. */
export const GenreGrid = ({ title, allLabel, genres, onSelect, onSelectAll }: GenreGridProps) => {
  if (genres.length === 0) return null;
  return (
    <View>
      <SectionHeader title={title} onSeeAll={onSelectAll} />
      <View style={styles.grid}>
        <AppPressable
          feedback="scale"
          onPress={onSelectAll}
          accessibilityLabel={allLabel}
          style={{ width: '48%' }}
        >
          <View style={styles.tile(true)}>
            <AppText role="title" scale="large" color="onPrimary" numberOfLines={2}>
              {allLabel}
            </AppText>
          </View>
        </AppPressable>
        {genres.map((genre) => (
          <AppPressable
            feedback="scale"
            key={genre.id}
            onPress={() => {
              onSelect(genre);
            }}
            accessibilityLabel={genre.name}
            style={{ width: '48%' }}
          >
            <View style={styles.tile(false)}>
              <AppText role="title" scale="large" color="onSurface" numberOfLines={2}>
                {genre.name}
              </AppText>
            </View>
          </AppPressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
  tile: (highlighted: boolean) => ({
    minHeight: theme.spacing.xxxl + theme.spacing.xl,
    justifyContent: 'flex-end',
    padding: theme.spacing.m,
    borderRadius: theme.shape.l,
    backgroundColor: highlighted ? theme.colors.primary : theme.colors.surface,
  }),
}));
