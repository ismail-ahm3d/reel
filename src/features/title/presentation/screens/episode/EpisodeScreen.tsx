import { FlatList, ScrollView, View, useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppScrim } from '@shared/core/presentation/components/AppScrim';
import { heroBlend } from '@features/title/presentation/screens/details/components/DetailsHero';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { ExpandableText } from '@shared/presentation/components/ExpandableText';
import { ImageRail } from '@shared/presentation/components/ImageRail';
import { PersonCard } from '@shared/presentation/components/PersonCard';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import { formatCount, formatDate, formatRuntime } from '@shared/presentation/mappers/mediaText';
import {
  useEpisodeScreen,
  type EpisodeScreenProps,
} from '@features/title/presentation/screens/episode/useEpisodeScreen';

export const EpisodeScreen = (props: EpisodeScreenProps) => {
  const view = useEpisodeScreen(props);
  const t = useTranslate();
  const locale = useLocale();
  const { width } = useWindowDimensions();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.episode === null) return <AppLoading />;

  const { episode } = view;
  const meta = [
    t({ key: 'title.episodeCode', params: { season: episode.season, episode: episode.number } }),
    formatDate(episode.airDate, locale),
    episode.runtimeMinutes === null ? null : t(formatRuntime(episode.runtimeMinutes)),
  ]
    .filter((part) => part !== null)
    .join(' · ');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { height: (width * 9) / 16 + 80 + heroBlend }]}>
        <AppImage uri={episode.still?.large ?? null} fill />
        <AppScrim blendBottom={heroBlend / ((width * 9) / 16 + 80 + heroBlend)} />
        <View style={styles.caption}>
          <AppText role="label" scale="large" color="onScrim">
            {meta}
          </AppText>
          <AppText role="display" scale="small" color="onScrim" accessibilityRole="header" numberOfLines={3}>
            {episode.name}
          </AppText>
        </View>
      </View>
      <View style={styles.body}>
        {episode.rating !== null && (
          <View style={styles.rating}>
            <RatingBadge rating={episode.rating} />
            <AppText role="label" scale="large" color="onSurfaceVariant">
              {t({ key: 'title.voteCount', params: { count: formatCount(episode.voteCount, locale) } })}
            </AppText>
          </View>
        )}
        {episode.overview !== '' && (
          <ExpandableText text={episode.overview} moreLabel={t({ key: 'common.more' })} />
        )}
      </View>
      {view.keyCrew.length > 0 && (
        <View style={styles.crew}>
          {view.keyCrew.map((member) => (
            <AppPressable
              key={`${member.personId}-${member.job}`}
              onPress={() => {
                view.openPerson(member.personId);
              }}
              accessibilityLabel={`${member.job}: ${member.name}`}
            >
              <View style={styles.crewRow}>
                <AppText role="body" scale="medium" color="onSurfaceVariant" style={{ flex: 1 }}>
                  {member.job}
                </AppText>
                <AppText role="body" scale="medium" color="primary">
                  {member.name}
                </AppText>
              </View>
            </AppPressable>
          ))}
        </View>
      )}
      {episode.guestStars.length > 0 && (
        <View>
          <SectionHeader title={t({ key: 'title.guestStars' })} />
          <FlatList
            horizontal
            data={episode.guestStars}
            keyExtractor={(member, index) => `${member.personId}-${index}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
            renderItem={({ item }) => (
              <PersonCard
                name={item.name}
                detail={item.role}
                imageUri={item.profile?.small ?? null}
                onPress={() => {
                  view.openPerson(item.personId);
                }}
              />
            )}
          />
        </View>
      )}
      <ImageRail
        title={t({ key: 'title.stills' })}
        images={episode.stills}
        height={110}
        onSelect={view.openStill}
        itemLabel={(index) => t({ key: 'gallery.imageLabel', params: { number: index + 1 } })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
  },
  hero: {
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.scrim,
  },
  caption: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: heroBlend * 0.7,
    gap: theme.spacing.xs,
  },
  body: {
    marginTop: -heroBlend * 0.4,
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.s,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  crew: {
    marginHorizontal: theme.spacing.l,
    borderRadius: theme.shape.l,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  crewRow: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  rail: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
}));
