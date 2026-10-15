import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type Tag = { readonly id: number; readonly name: string };

export type TagCloudProps<T extends Tag> = {
  readonly title: string;
  readonly tags: readonly T[];
  readonly onSelect: (tag: T) => void;
};

/** Keywords as capsules; each opens every title carrying it. */
export const TagCloud = <T extends Tag>({ title, tags, onSelect }: TagCloudProps<T>) => {
  if (tags.length === 0) return null;
  return (
    <View>
      <SectionHeader title={title} />
      <View style={styles.wrap}>
        {tags.slice(0, 24).map((tag) => (
          <AppChip
            key={tag.id}
            label={tag.name}
            icon={{ ios: 'number', android: 'tag' }}
            onPress={() => {
              onSelect(tag);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
}));
