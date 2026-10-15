import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { formatDate } from '@shared/presentation/mappers/mediaText';
import { EpisodeRow } from '@features/title/presentation/screens/season/components/EpisodeRow';
import {
  useSeasonScreen,
  type SeasonScreenProps,
} from '@features/title/presentation/screens/season/useSeasonScreen';

export const SeasonScreen = (props: SeasonScreenProps) => {
  const view = useSeasonScreen(props);
  const t = useTranslate();
  const locale = useLocale();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.season === null) return <AppLoading />;

  const { season } = view;
  const aired = formatDate(season.airDate, locale);

  return (
    <FlatList
      data={season.episodes}
      keyExtractor={(episode) => String(episode.number)}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <AppText role="label" scale="large" color="onSurfaceVariant">
            {[t({ key: 'title.episodeCount', params: { count: season.episodes.length } }), aired]
              .filter((part) => part !== null)
              .join(' · ')}
          </AppText>
          {season.overview !== '' && (
            <AppText role="body" scale="large">
              {season.overview}
            </AppText>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <EpisodeRow
          episode={item}
          onPress={() => {
            view.openEpisode(item.number);
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
  },
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    gap: theme.spacing.s,
  },
  separator: {
    height: theme.border.hairline,
    marginStart: theme.spacing.l,
    backgroundColor: theme.colors.outline,
  },
}));
