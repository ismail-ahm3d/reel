import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type TrendingListProps = {
  readonly title: string;
  readonly items: readonly MediaSummary[];
  readonly onSelect: (media: MediaSummary) => void;
};

/** A ranked list: the rank, a thumbnail and the title, separated by inset hairlines. */
export const TrendingList = ({ title, items, onSelect }: TrendingListProps) => {
  if (items.length === 0) return null;
  return (
    <View>
      <SectionHeader title={title} />
      {items.map((media, index) => (
        <AppPressable
          key={mediaRefKey(media.ref)}
          onPress={() => {
            onSelect(media);
          }}
          accessibilityLabel={`${index + 1}. ${media.title}`}
        >
          <View style={styles.row}>
            <AppText role="headline" scale="small" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
              {index + 1}
            </AppText>
            <AppImage
              uri={media.backdrop?.small ?? media.poster?.small ?? null}
              shape="s"
              style={{ width: 96, aspectRatio: 16 / 9 }}
            />
            <View style={styles.text}>
              <AppText role="title" scale="medium" numberOfLines={2}>
                {media.title}
              </AppText>
              {media.year !== null && (
                <AppText role="body" scale="small" color="onSurfaceVariant">
                  {media.year}
                </AppText>
              )}
            </View>
          </View>
        </AppPressable>
      ))}
    </View>
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
