import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import type { SeasonSummary } from '@features/title/domain/model/titleDetails';

export type SeasonsRailProps = {
  readonly seasons: readonly SeasonSummary[];
  readonly fallbackPoster: string | null;
  readonly onSelect: (season: SeasonSummary) => void;
};

const width = 116;

export const SeasonsRail = ({ seasons, fallbackPoster, onSelect }: SeasonsRailProps) => {
  const t = useTranslate();
  if (seasons.length === 0) return null;
  return (
    <View>
      <SectionHeader title={t({ key: 'title.seasons' })} />
      <FlatList
        horizontal
        data={seasons}
        keyExtractor={(season) => String(season.number)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => {
          const episodes = t({ key: 'title.episodeCount', params: { count: item.episodeCount } });
          return (
            <AppPressable
              feedback="scale"
              onPress={() => {
                onSelect(item);
              }}
              accessibilityLabel={`${item.name}, ${episodes}`}
              style={{ width }}
            >
              <AppImage
                uri={item.poster?.medium ?? fallbackPoster}
                shape="m"
                style={{ width, aspectRatio: 2 / 3 }}
              />
              <View style={styles.caption}>
                <AppText role="body" scale="small" numberOfLines={1}>
                  {item.name}
                </AppText>
                <AppText role="label" scale="medium" color="onSurfaceVariant" numberOfLines={1}>
                  {item.year === null ? episodes : `${item.year} · ${episodes}`}
                </AppText>
              </View>
            </AppPressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  rail: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
  caption: {
    marginTop: theme.spacing.s,
    gap: theme.spacing.xxs,
  },
}));
