import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';

export type MediaRowProps = {
  readonly media: MediaSummary;
  readonly onPress: (media: MediaSummary) => void;
  /** Overrides the default "Movie · 2024" line, for a role or an episode count. */
  readonly detail?: string;
};

/** A list row with a small poster, the way search results and filmographies read. */
export const MediaRow = ({ media, onPress, detail }: MediaRowProps) => {
  const t = useTranslate();
  const kind = t({ key: media.ref.type === 'movie' ? 'media.movie' : 'media.tv' });
  const line = detail ?? (media.year === null ? kind : `${kind} · ${media.year}`);
  return (
    <AppPressable
      onPress={() => {
        onPress(media);
      }}
      accessibilityLabel={`${media.title}, ${line}`}
    >
      <View style={styles.row}>
        <AppImage
          uri={media.poster?.small ?? null}
          shape="s"
          style={{ width: 56, aspectRatio: 2 / 3 }}
          recyclingKey={mediaRefKey(media.ref)}
        />
        <View style={styles.text}>
          <AppText role="title" scale="large" numberOfLines={2}>
            {media.title}
          </AppText>
          <AppText role="body" scale="small" color="onSurfaceVariant" numberOfLines={1}>
            {line}
          </AppText>
          {media.rating !== null && <RatingBadge rating={media.rating} />}
        </View>
        <AppIcon
          name={{ ios: 'chevron.right', android: 'chevron_right', directional: true }}
          size="s"
          color="outline"
        />
      </View>
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
  },
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
