import { FlatList, View, useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppScrim } from '@shared/core/presentation/components/AppScrim';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { mediaRefKey } from '@shared/domain/model/media';
import { ExpandableText } from '@shared/presentation/components/ExpandableText';
import { MediaRow } from '@shared/presentation/components/MediaRow';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';
import { heroBlend } from '@features/title/presentation/screens/details/components/DetailsHero';
import {
  useCollectionScreen,
  type CollectionScreenProps,
} from '@features/title/presentation/screens/collection/useCollectionScreen';

export const CollectionScreen = (props: CollectionScreenProps) => {
  const view = useCollectionScreen(props);
  const t = useTranslate();
  const { width } = useWindowDimensions();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.collection === null) return <AppLoading />;

  const { collection } = view;

  return (
    <FlatList
      data={collection.parts}
      keyExtractor={(media) => mediaRefKey(media.ref)}
      contentInsetAdjustmentBehavior="never"
      style={styles.screen}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={[styles.hero, { height: Math.min(width * 0.9, 520) + heroBlend }]}>
            <AppImage uri={collection.backdrop?.large ?? collection.poster?.large ?? null} fill />
            <AppScrim blendBottom={heroBlend / (Math.min(width * 0.9, 520) + heroBlend)} />
            <View style={styles.caption}>
              <AppText role="display" scale="small" color="onScrim" accessibilityRole="header">
                {collection.name}
              </AppText>
              <View style={styles.meta}>
                <AppText role="label" scale="large" color="onScrim">
                  {t({ key: 'title.collectionCount', params: { count: collection.parts.length } })}
                </AppText>
                {view.averageRating !== null && <RatingBadge rating={view.averageRating} variant="onImage" />}
              </View>
            </View>
          </View>
          <View style={styles.overview}>
            {view.saveError !== null && (
              <AppErrorBanner text={errorText(view.saveError)} onDismiss={view.dismissSaveError} />
            )}
            <AppButton
              label={t({ key: view.isAllSaved ? 'title.allInWatchlist' : 'title.addAllToWatchlist' })}
              icon={
                view.isAllSaved
                  ? { ios: 'bookmark.fill', android: 'bookmark_added' }
                  : { ios: 'bookmark', android: 'bookmark_add' }
              }
              variant={view.isAllSaved ? 'secondary' : 'primary'}
              onPress={view.toggleAllSaved}
              disabled={view.isSaving}
            />
            {collection.overview !== '' && (
              <ExpandableText text={collection.overview} moreLabel={t({ key: 'common.more' })} />
            )}
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <MediaRow
          media={item}
          onPress={view.openMedia}
          detail={[
            t({ key: 'title.partNumber', params: { number: index + 1 } }),
            item.year === null ? null : String(item.year),
          ]
            .filter((part) => part !== null)
            .join(' · ')}
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
    gap: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  hero: {
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.scrim,
  },
  caption: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: heroBlend * 0.7,
    gap: theme.spacing.s,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  overview: {
    // Rides up into the last of the hero's fade, like the title page's buttons.
    marginTop: -heroBlend * 0.4 - theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.l,
  },
}));
