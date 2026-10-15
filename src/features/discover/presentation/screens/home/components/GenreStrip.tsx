import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import type { Genre } from '@shared/domain/model/genre';

export type GenreStripProps = {
  readonly genres: readonly Genre[];
  readonly allLabel: string;
  readonly onSelect: (genre: Genre) => void;
  readonly onSelectAll: () => void;
};

/** A row of genre capsules leading into the filtered browser. */
export const GenreStrip = ({ genres, allLabel, onSelect, onSelectAll }: GenreStripProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.strip}
    style={styles.container}
  >
    <AppChip
      label={allLabel}
      icon={{ ios: 'line.3.horizontal.decrease', android: 'filter_list' }}
      onPress={onSelectAll}
    />
    {genres.map((genre) => (
      <AppChip
        key={genre.id}
        label={genre.name}
        onPress={() => {
          onSelect(genre);
        }}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.spacing.xl,
    flexGrow: 0,
  },
  strip: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.s,
  },
}));
