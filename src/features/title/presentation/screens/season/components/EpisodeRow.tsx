import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';
import { formatDate, formatRuntime } from '@shared/presentation/mappers/mediaText';
import type { Episode } from '@features/title/domain/model/season';

export type EpisodeRowProps = {
  readonly episode: Episode;
  readonly onPress: () => void;
};

export const EpisodeRow = ({ episode, onPress }: EpisodeRowProps) => {
  const t = useTranslate();
  const locale = useLocale();
  const meta = [
    formatDate(episode.airDate, locale),
    episode.runtimeMinutes === null ? null : t(formatRuntime(episode.runtimeMinutes)),
  ]
    .filter((part) => part !== null)
    .join(' · ');
  return (
    <AppPressable onPress={onPress} accessibilityLabel={`${episode.number}. ${episode.name}`}>
      <View style={styles.row}>
        <View style={styles.top}>
          <AppImage
            uri={episode.still?.small ?? null}
            shape="m"
            style={{ width: 144, aspectRatio: 16 / 9 }}
          />
          <View style={styles.titles}>
            <AppText role="label" scale="medium" color="onSurfaceVariant">
              {t({ key: 'title.episodeNumber', params: { number: episode.number } }).toUpperCase()}
            </AppText>
            <AppText role="title" scale="medium" numberOfLines={2}>
              {episode.name}
            </AppText>
            {meta !== '' && (
              <AppText role="label" scale="medium" color="onSurfaceVariant">
                {meta}
              </AppText>
            )}
            {episode.rating !== null && <RatingBadge rating={episode.rating} />}
          </View>
        </View>
        {episode.overview !== '' && (
          <AppText role="body" scale="medium" color="onSurfaceVariant" numberOfLines={4}>
            {episode.overview}
          </AppText>
        )}
      </View>
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    gap: theme.spacing.s,
  },
  top: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  titles: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
