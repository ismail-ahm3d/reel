import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { DetailsSkeleton } from '@shared/presentation/components/Skeletons';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate, type Translate } from '@shared/core/presentation/i18n/useTranslate';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppIconButton } from '@shared/core/presentation/components/AppIconButton';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { ExternalLinks } from '@shared/presentation/components/ExternalLinks';
import { ImageRail } from '@shared/presentation/components/ImageRail';
import { MediaRail } from '@shared/presentation/components/MediaRail';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';
import {
  formatCount,
  formatDate,
  formatMoney,
  formatRuntime,
  languageName,
} from '@shared/presentation/mappers/mediaText';
import type { TitleDetails } from '@features/title/domain/model/titleDetails';
import { CastRail } from '@features/title/presentation/screens/details/components/CastRail';
import { CollectionCard } from '@features/title/presentation/screens/details/components/CollectionCard';
import { CompanyRail } from '@features/title/presentation/screens/details/components/CompanyRail';
import { ReleaseList } from '@features/title/presentation/screens/details/components/ReleaseList';
import { ReviewsRail } from '@features/title/presentation/screens/details/components/ReviewsRail';
import { TagCloud } from '@features/title/presentation/screens/details/components/TagCloud';
import { DetailsHero, heroBlend } from '@features/title/presentation/screens/details/components/DetailsHero';
import { ExpandableText } from '@shared/presentation/components/ExpandableText';
import { InfoList, type InfoRow } from '@features/title/presentation/screens/details/components/InfoList';
import { SeasonsRail } from '@features/title/presentation/screens/details/components/SeasonsRail';
import { VideosRail } from '@features/title/presentation/screens/details/components/VideosRail';
import { WatchProviders } from '@features/title/presentation/screens/details/components/WatchProviders';
import {
  useTitleDetailsScreen,
  type TitleDetailsScreenProps,
} from '@features/title/presentation/screens/details/useTitleDetailsScreen';

const metaLine = (details: TitleDetails, t: Translate): string => {
  const parts: string[] = [];
  const { summary, show } = details;
  if (summary.year !== null) {
    const end = show?.lastAirYear ?? null;
    parts.push(
      show !== null && end !== null && end !== summary.year && details.status !== 'Returning Series'
        ? `${summary.year}–${end}`
        : String(summary.year),
    );
  }
  if (details.certification !== null) parts.push(details.certification);
  if (show !== null) parts.push(t({ key: 'title.seasonCount', params: { count: show.numberOfSeasons } }));
  else if (details.runtimeMinutes !== null) parts.push(t(formatRuntime(details.runtimeMinutes)));
  return parts.join(' · ');
};

const infoRows = (details: TitleDetails, t: Translate, locale: string | undefined): readonly InfoRow[] => {
  const isShow = details.show !== null;
  const rows: (InfoRow | null)[] = [
    details.creators.length > 0
      ? {
          label: t({ key: isShow ? 'title.info.createdBy' : 'title.info.director' }),
          value: details.creators.map((person) => person.name).join(t({ key: 'common.listSeparator' })),
        }
      : null,
    details.writers.length > 0
      ? {
          label: t({ key: 'title.info.writers' }),
          value: details.writers.map((person) => person.name).join(t({ key: 'common.listSeparator' })),
        }
      : null,
    details.status !== null ? { label: t({ key: 'title.info.status' }), value: details.status } : null,
    (() => {
      const date = formatDate(details.releaseDate, locale);
      return date === null
        ? null
        : { label: t({ key: isShow ? 'title.info.firstAired' : 'title.info.released' }), value: date };
    })(),
    details.show?.nextEpisode
      ? {
          label: t({ key: 'title.info.nextEpisode' }),
          value: [
            t({
              key: 'title.episodeCode',
              params: { season: details.show.nextEpisode.season, episode: details.show.nextEpisode.episode },
            }),
            formatDate(details.show.nextEpisode.airDate, locale),
          ]
            .filter((part) => part !== null)
            .join(' · '),
        }
      : null,
    isShow && details.runtimeMinutes !== null
      ? { label: t({ key: 'title.info.episodeRuntime' }), value: t(formatRuntime(details.runtimeMinutes)) }
      : null,
    details.show !== null
      ? { label: t({ key: 'title.info.episodes' }), value: String(details.show.numberOfEpisodes) }
      : null,
    details.show !== null && details.show.networks.length > 0
      ? {
          label: t({ key: 'title.info.networks' }),
          value: details.show.networks
            .map((network) => network.name)
            .join(t({ key: 'common.listSeparator' })),
        }
      : null,
    details.originalLanguage !== null
      ? { label: t({ key: 'title.info.language' }), value: languageName(details.originalLanguage, locale) }
      : null,
    details.originalTitle !== details.summary.title
      ? { label: t({ key: 'title.info.originalTitle' }), value: details.originalTitle }
      : null,
    details.budget !== null
      ? { label: t({ key: 'title.info.budget' }), value: formatMoney(details.budget, locale) }
      : null,
    details.revenue !== null
      ? { label: t({ key: 'title.info.revenue' }), value: formatMoney(details.revenue, locale) }
      : null,
  ];
  return rows.filter((row): row is InfoRow => row !== null);
};

/** Rendered under the main buttons once the page has loaded: the account's actions, filled by the route. */
export type TitleDetailsSlots = {
  readonly renderAccountBar?: (title: string) => ReactNode;
};

export const TitleDetailsScreen = ({
  renderAccountBar,
  ...props
}: TitleDetailsScreenProps & TitleDetailsSlots) => {
  const view = useTitleDetailsScreen(props);
  const t = useTranslate();
  const locale = useLocale();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.details === null) return <DetailsSkeleton />;

  const { details } = view;
  const { summary } = details;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <DetailsHero
        title={summary.title}
        logo={
          details.logo === null
            ? null
            : { uri: details.logo.image.medium, aspectRatio: details.logo.aspectRatio }
        }
        imageUri={summary.backdrop?.large ?? summary.poster?.large ?? null}
        metaLine={metaLine(details, t)}
        genreLine={details.genres.map((genre) => genre.name).join(t({ key: 'common.listSeparator' }))}
      />

      <View style={styles.body}>
        <View style={styles.actions}>
          {view.trailer !== null && (
            <AppButton
              label={t({ key: 'title.trailer' })}
              icon={{ ios: 'play.fill', android: 'play_arrow' }}
              onPress={view.playTrailer}
              style={{ flex: 1 }}
            />
          )}
          <AppButton
            label={t({ key: view.isSaved ? 'title.inWatchlist' : 'title.addToWatchlist' })}
            icon={view.isSaved ? { ios: 'checkmark', android: 'check' } : { ios: 'plus', android: 'add' }}
            variant={view.trailer === null ? 'primary' : 'secondary'}
            onPress={view.toggleWatchlist}
            disabled={view.isSaving}
            style={{ flex: 1 }}
          />
          <AppIconButton
            icon={{ ios: 'square.and.arrow.up', android: 'share' }}
            accessibilityLabel={t({ key: 'common.share' })}
            onPress={view.share}
          />
        </View>

        {renderAccountBar?.(summary.title)}
        {view.actionError !== null && (
          <AppErrorBanner text={errorText(view.actionError)} onDismiss={view.dismissActionError} />
        )}

        <View style={styles.padded}>
          {summary.rating !== null && (
            <View style={styles.rating}>
              <RatingBadge rating={summary.rating} />
              <AppText role="label" scale="large" color="onSurfaceVariant">
                {t({ key: 'title.voteCount', params: { count: formatCount(summary.voteCount, locale) } })}
              </AppText>
            </View>
          )}
          {details.tagline !== null && (
            <AppText role="title" scale="large" color="onSurfaceVariant">
              {details.tagline}
            </AppText>
          )}
          {summary.overview !== '' && (
            <ExpandableText text={summary.overview} moreLabel={t({ key: 'common.more' })} />
          )}
        </View>

        {details.watch !== null && <WatchProviders options={details.watch} onOpen={view.openLink} />}
        {details.collection !== null && (
          <CollectionCard collection={details.collection} onPress={view.openCollection} />
        )}
        {details.show !== null && (
          <SeasonsRail
            seasons={details.show.seasons}
            fallbackPoster={summary.poster?.medium ?? null}
            onSelect={view.openSeason}
          />
        )}
        <CastRail
          title={t({ key: 'title.castAndCrew' })}
          cast={details.cast}
          onSelect={view.openPerson}
          onSeeAll={view.openCredits}
          episodesLabel={(count) => t({ key: 'title.episodeCount', params: { count } })}
        />
        <VideosRail videos={details.videos} onSelect={view.playVideo} />
        <ImageRail
          title={t({ key: 'title.backdrops' })}
          images={details.images.backdrops}
          height={120}
          onSelect={(index) => {
            view.openGallery('backdrops', index);
          }}
          onSeeAll={() => {
            view.openGallery('backdrops', 0);
          }}
          itemLabel={(index) => t({ key: 'gallery.imageLabel', params: { number: index + 1 } })}
        />
        <ImageRail
          title={t({ key: 'title.posters' })}
          images={details.images.posters}
          height={170}
          onSelect={(index) => {
            view.openGallery('posters', index);
          }}
          onSeeAll={() => {
            view.openGallery('posters', 0);
          }}
          itemLabel={(index) => t({ key: 'gallery.imageLabel', params: { number: index + 1 } })}
        />
        <ReviewsRail reviews={view.reviews} total={view.reviewCount} onSeeAll={view.openReviews} />
        <MediaRail
          title={t({ key: 'title.moreLikeThis' })}
          items={details.recommendations}
          onSelect={view.openMedia}
        />
        <TagCloud
          title={t({ key: 'title.keywords' })}
          tags={details.keywords}
          onSelect={view.browseKeyword}
        />
        {details.show !== null && (
          <CompanyRail
            title={t({ key: 'title.networks' })}
            companies={details.show.networks}
            onSelect={view.browseNetwork}
          />
        )}
        <CompanyRail
          title={t({ key: 'title.studios' })}
          companies={details.companies}
          onSelect={view.browseCompany}
        />
        <ReleaseList releases={details.releases} />
        <InfoList title={t({ key: 'title.information' })} rows={infoRows(details, t, locale)} />
        <ExternalLinks links={details.links} onOpen={view.openLink} />
      </View>
    </ScrollView>
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
  body: {
    gap: theme.spacing.xl,
    // The buttons sit in the last of the hero's fade, where it has become the page.
    marginTop: -heroBlend * 0.4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  padded: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.s,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
}));
