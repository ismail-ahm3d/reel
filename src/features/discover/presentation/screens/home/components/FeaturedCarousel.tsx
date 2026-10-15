import { useEffect, useRef, useState } from 'react';
import { Animated, I18nManager, View, useWindowDimensions, type FlatList } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppScrim } from '@shared/core/presentation/components/AppScrim';
import { AppText } from '@shared/core/presentation/components/AppText';
import { useReduceMotion } from '@shared/core/presentation/hooks/useReduceMotion';
import { scrollPage } from '@shared/core/presentation/mappers/scrollPage';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';
import type { TitleLogo } from '@shared/domain/model/titleLogo';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';

export type FeaturedCarouselProps = {
  readonly items: readonly MediaSummary[];
  readonly onSelect: (media: MediaSummary) => void;
  /** Moves on to the next card by itself; off while the screen is out of sight. */
  readonly autoplay: boolean;
  /** The title card to show instead of the typed title; null types it, undefined is loading. */
  readonly logoOf: (media: MediaSummary) => TitleLogo | null | undefined;
};

/** The tallest a logo stands on a card; wide wordmarks are capped by width instead. */
const logoMaxHeight = 64;

/** The logo's box inside a card of the given width, keeping the logo's own proportions. */
const logoSize = (logo: TitleLogo, cardWidth: number) => {
  const width = Math.min(cardWidth * 0.62, logoMaxHeight * logo.aspectRatio);
  return { width, height: width / logo.aspectRatio };
};

/** How long a card stays before the carousel moves on by itself. */
const autoplayDelayMs = 5000;

/**
 * Large artwork cards that snap one at a time, with the next one peeking in. The dots follow the
 * finger: the current one stretches into a pill and hands it to the next as the cards move.
 */
export const FeaturedCarousel = ({ items, onSelect, autoplay, logoOf }: FeaturedCarouselProps) => {
  const { theme } = useUnistyles();
  const t = useTranslate();
  const { width } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const listRef = useRef<FlatList<MediaSummary>>(null);
  const [scrollX] = useState(() => new Animated.Value(0));
  const [page, setPage] = useState(0);
  const [isTouching, setTouching] = useState(false);

  const count = items.length;
  const cardWidth = Math.min(width - theme.spacing.l * 2, 640);
  const interval = cardWidth + theme.spacing.m;
  const contentWidth = theme.spacing.l * 2 + count * cardWidth + Math.max(count - 1, 0) * theme.spacing.m;
  const lastOffset = Math.max(contentWidth - width, 0);
  // Offsets run from the physical left; in right-to-left the first card is on the right.
  const progress = Animated.divide(
    I18nManager.isRTL ? Animated.subtract(lastOffset, scrollX) : scrollX,
    interval,
  );

  useEffect(() => {
    if (!autoplay || reduceMotion || isTouching || count < 2) return;
    const timer = setTimeout(() => {
      const next = (page + 1) % count;
      // Scrolling to an offset counts from the first card in either direction; only the scroll
      // events report offsets from the physical left (see progress below).
      listRef.current?.scrollToOffset({ offset: next * interval, animated: true });
      setPage(next);
    }, autoplayDelayMs);
    return () => {
      clearTimeout(timer);
    };
  }, [autoplay, reduceMotion, isTouching, page, count, interval]);

  if (count === 0) return null;
  return (
    <View style={styles.carousel}>
      <Animated.FlatList
        ref={listRef}
        horizontal
        data={items}
        keyExtractor={(item) => mediaRefKey(item.ref)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        decelerationRate="fast"
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onScrollBeginDrag={() => {
          setTouching(true);
        }}
        onMomentumScrollEnd={(event) => {
          setPage(scrollPage(event.nativeEvent, interval));
          setTouching(false);
        }}
        renderItem={({ item }) => {
          const logo = logoOf(item);
          return (
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
                  {logo === undefined ? (
                    <View style={{ height: logoMaxHeight }} />
                  ) : logo === null ? (
                    <AppText role="display" scale="small" color="onScrim" numberOfLines={2}>
                      {item.title}
                    </AppText>
                  ) : (
                    <View style={styles.logo}>
                      <AppImage
                        uri={logo.image.medium}
                        fit="contain"
                        transparent
                        style={logoSize(logo, cardWidth)}
                      />
                    </View>
                  )}
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
          );
        }}
        extraData={logoOf}
      />
      <View style={styles.dots} accessible={false}>
        {items.map((item, index) => {
          const inputRange = [index - 1, index, index + 1];
          return (
            <Animated.View
              key={mediaRefKey(item.ref)}
              style={[
                styles.dot,
                {
                  width: progress.interpolate({
                    inputRange,
                    outputRange: [dotSize(theme), activeDotWidth(theme), dotSize(theme)],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.dotFill,
                  {
                    opacity: progress.interpolate({
                      inputRange,
                      outputRange: [0, 1, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

type Theme = ReturnType<typeof useUnistyles>['theme'];
const dotSize = (theme: Theme) => theme.spacing.xs + theme.spacing.xxs;
const activeDotWidth = (theme: Theme) => theme.spacing.l;

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
  logo: {
    alignSelf: 'flex-start',
    marginVertical: theme.spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.m,
  },
  dot: {
    height: dotSize(theme),
    borderRadius: theme.shape.full,
    overflow: 'hidden',
    backgroundColor: theme.colors.outline,
  },
  dotFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.onBackground,
  },
}));
