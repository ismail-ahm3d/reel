import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import type { SizedImage } from '@shared/domain/model/imageSet';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type ImageRailProps = {
  readonly title: string;
  readonly images: readonly SizedImage[];
  /** Height of every tile; widths follow each image's own shape. */
  readonly height: number;
  readonly onSelect: (index: number) => void;
  readonly onSeeAll?: () => void;
  readonly itemLabel: (index: number) => string;
};

const limit = 16;

/** A row of photos at one height, each as wide as its shape asks, opening the full-screen viewer. */
export const ImageRail = ({ title, images, height, onSelect, onSeeAll, itemLabel }: ImageRailProps) => {
  if (images.length === 0) return null;
  return (
    <View>
      <SectionHeader title={title} {...(onSeeAll === undefined ? {} : { onSeeAll })} />
      <FlatList
        horizontal
        data={images.slice(0, limit)}
        keyExtractor={(item) => item.image.large}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item, index }) => (
          <AppPressable
            feedback="scale"
            onPress={() => {
              onSelect(index);
            }}
            accessibilityLabel={itemLabel(index)}
          >
            <AppImage
              uri={item.image.small}
              shape="m"
              style={{ height, width: Math.round(height * item.aspectRatio) }}
            />
          </AppPressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  rail: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.s,
  },
}));
