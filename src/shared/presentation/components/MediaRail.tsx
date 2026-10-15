import type { ReactElement } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';
import { BackdropCard } from '@shared/presentation/components/BackdropCard';
import { PosterCard } from '@shared/presentation/components/PosterCard';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type MediaRailProps = {
  readonly title: string;
  readonly items: readonly MediaSummary[];
  readonly onSelect: (media: MediaSummary) => void;
  readonly onSeeAll?: () => void;
  /** poster for browsing, backdrop for featured rows. */
  readonly variant?: 'poster' | 'backdrop';
  readonly accessory?: ReactElement;
};

const posterWidth = 116;
const backdropWidth = 280;

/** A titled horizontal row of titles. Renders nothing when the list is empty. */
export const MediaRail = ({
  title,
  items,
  onSelect,
  onSeeAll,
  variant = 'poster',
  accessory,
}: MediaRailProps) => {
  const { theme } = useUnistyles();
  if (items.length === 0) return null;
  return (
    <View style={styles.rail}>
      <SectionHeader
        title={title}
        {...(onSeeAll === undefined ? {} : { onSeeAll })}
        {...(accessory === undefined ? {} : { accessory })}
      />
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => mediaRefKey(item.ref)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        decelerationRate="fast"
        snapToInterval={(variant === 'poster' ? posterWidth : backdropWidth) + theme.spacing.m}
        snapToAlignment="start"
        renderItem={({ item }) =>
          variant === 'poster' ? (
            <PosterCard media={item} onPress={onSelect} width={posterWidth} />
          ) : (
            <BackdropCard media={item} onPress={onSelect} width={backdropWidth} />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  rail: {
    marginBottom: theme.spacing.xl,
  },
  content: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
}));
