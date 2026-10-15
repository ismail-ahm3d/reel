import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppScrim } from '@shared/core/presentation/components/AppScrim';
import { AppText } from '@shared/core/presentation/components/AppText';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';

export type BackdropCardProps = {
  readonly media: MediaSummary;
  readonly onPress: (media: MediaSummary) => void;
  readonly width: number;
};

/** A wide 16:9 card with the title over the artwork, for the "featured" rails. */
export const BackdropCard = ({ media, onPress, width }: BackdropCardProps) => (
  <AppPressable
    feedback="scale"
    onPress={() => {
      onPress(media);
    }}
    accessibilityLabel={media.title}
    style={{ width }}
  >
    <View style={styles.frame}>
      <AppImage
        uri={media.backdrop?.medium ?? media.poster?.medium ?? null}
        fill
        recyclingKey={mediaRefKey(media.ref)}
      />
      <AppScrim />
      <View style={styles.caption}>
        <AppText role="title" scale="large" color="onScrim" numberOfLines={2}>
          {media.title}
        </AppText>
      </View>
    </View>
  </AppPressable>
);

const styles = StyleSheet.create((theme) => ({
  frame: {
    aspectRatio: 16 / 9,
    borderRadius: theme.shape.l,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'flex-end',
  },
  caption: {
    padding: theme.spacing.m,
  },
}));
