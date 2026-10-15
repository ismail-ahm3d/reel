import { useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppScrim } from '@shared/core/presentation/components/AppScrim';
import { AppText } from '@shared/core/presentation/components/AppText';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';

export type FeaturedCarouselProps = {
  readonly items: readonly MediaSummary[];
  readonly onSelect: (media: MediaSummary) => void;
};

/** Large artwork cards that snap one at a time, with the next one peeking in. */
export const FeaturedCarousel = ({ items, onSelect }: FeaturedCarouselProps) => {
  const { theme } = useUnistyles();
  const t = useTranslate();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const cardWidth = Math.min(width - theme.spacing.l * 2, 640);
  const interval = cardWidth + theme.spacing.m;
  if (items.length === 0) return null;
  return (
    <View style={styles.carousel}>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => mediaRefKey(item.ref)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        decelerationRate="fast"
        contentContainerStyle={styles.content}
        onMomentumScrollEnd={(event) => {
          setPage(Math.round(event.nativeEvent.contentOffset.x / interval));
        }}
        renderItem={({ item }) => (
          <AppPressable
            feedback="scale"
            onPress={() => {
              onSelect(item);
            }}
            accessibilityLabel={item.title}
            style={{ width: cardWidth }}
          >
            <View style={styles.card}>
              <AppImage uri={item.backdrop?.large ?? null} fill recyclingKey={mediaRefKey(item.ref)} />
              <AppScrim />
              <View style={styles.caption}>
                <AppText role="label" scale="small" color="onScrim">
                  {t({ key: 'discover.featured' }).toUpperCase()}
                </AppText>
                <AppText role="display" scale="small" color="onScrim" numberOfLines={2}>
                  {item.title}
                </AppText>
                <View style={styles.meta}>
                  {item.rating !== null && <RatingBadge rating={item.rating} variant="onImage" />}
                  {item.year !== null && (
                    <AppText role="label" scale="large" color="onScrim">
                      {item.year}
                    </AppText>
                  )}
                </View>
              </View>
            </View>
          </AppPressable>
        )}
      />
      <View style={styles.dots} accessible={false}>
        {items.map((item, index) => (
          <View key={mediaRefKey(item.ref)} style={styles.dot(index === page)} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  carousel: {
    marginBottom: theme.spacing.l,
  },
  content: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
  card: {
    aspectRatio: 4 / 3,
    borderRadius: theme.shape.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.surfaceVariant,
  },
  caption: {
    padding: theme.spacing.l,
    gap: theme.spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.m,
  },
  dot: (active: boolean) => ({
    width: active ? theme.spacing.l : theme.spacing.xs + theme.spacing.xxs,
    height: theme.spacing.xs + theme.spacing.xxs,
    borderRadius: theme.shape.full,
    backgroundColor: active ? theme.colors.onBackground : theme.colors.outline,
  }),
}));
