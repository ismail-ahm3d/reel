import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import type { Video } from '@features/title/domain/model/titleDetails';

export type VideosRailProps = {
  readonly videos: readonly Video[];
  readonly onSelect: (video: Video) => void;
};

const width = 240;

export const VideosRail = ({ videos, onSelect }: VideosRailProps) => {
  const t = useTranslate();
  if (videos.length === 0) return null;
  return (
    <View>
      <SectionHeader title={t({ key: 'title.videos' })} />
      <FlatList
        horizontal
        data={videos.slice(0, 12)}
        keyExtractor={(video) => video.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => (
          <AppPressable
            feedback="scale"
            onPress={() => {
              onSelect(item);
            }}
            accessibilityLabel={item.name}
            accessibilityHint={t({ key: 'title.playVideo' })}
            style={{ width }}
          >
            <View style={styles.thumb}>
              <AppImage uri={item.thumbnail} fill />
              <View style={styles.play}>
                <AppIcon name={{ ios: 'play.fill', android: 'play_arrow' }} size="m" color="onScrim" />
              </View>
            </View>
            <View style={styles.caption}>
              <AppText role="body" scale="small" numberOfLines={2}>
                {item.name}
              </AppText>
              <AppText role="label" scale="medium" color="onSurfaceVariant">
                {t({ key: `title.videoKind.${item.kind}` })}
              </AppText>
            </View>
          </AppPressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  rail: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
  thumb: {
    aspectRatio: 16 / 9,
    borderRadius: theme.shape.m,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceVariant,
  },
  play: {
    padding: theme.spacing.m,
    borderRadius: theme.shape.full,
    backgroundColor: theme.colors.scrim,
  },
  caption: {
    marginTop: theme.spacing.s,
    gap: theme.spacing.xxs,
  },
}));
