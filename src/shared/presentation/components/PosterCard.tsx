import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';
import { RatingBadge } from '@shared/presentation/components/RatingBadge';
import { mediaSubtitle } from '@shared/presentation/mappers/mediaText';

export type PosterCardProps = {
  readonly media: MediaSummary;
  readonly onPress: (media: MediaSummary) => void;
  /** The card's width; the poster keeps TMDB's 2:3. */
  readonly width: number;
  readonly showTitle?: boolean;
  /** Replaces the year and score line, such as the user's own rating. */
  readonly caption?: string;
  readonly onLongPress?: (media: MediaSummary) => void;
  /** Set while the grid is picking titles: shows the check circle. */
  readonly selection?: 'selected' | 'unselected';
};

export const PosterCard = ({
  media,
  onPress,
  width,
  showTitle = true,
  caption,
  onLongPress,
  selection,
}: PosterCardProps) => {
  const subtitle = caption ?? mediaSubtitle(media);
  const isSelected = selection === 'selected';
  return (
    <AppPressable
      feedback="scale"
      onPress={() => {
        onPress(media);
      }}
      {...(onLongPress === undefined
        ? {}
        : {
            onLongPress: () => {
              onLongPress(media);
            },
          })}
      accessibilityLabel={subtitle === '' ? media.title : `${media.title}, ${subtitle}`}
      {...(selection === undefined ? {} : { selected: isSelected })}
      style={{ width }}
    >
      <View>
        <AppImage
          uri={media.poster?.medium ?? null}
          shape="m"
          style={{ width, aspectRatio: 2 / 3 }}
          recyclingKey={mediaRefKey(media.ref)}
        />
        {media.poster === null && (
          <View style={styles.fallback}>
            <AppText
              role="title"
              scale="small"
              color="onSurfaceVariant"
              numberOfLines={4}
              style={{ textAlign: 'center' }}
            >
              {media.title}
            </AppText>
          </View>
        )}
        <View style={styles.border(isSelected)} pointerEvents="none" />
        {selection !== undefined && (
          <View style={styles.check} pointerEvents="none">
            <View style={styles.checkCircle(isSelected)}>
              {isSelected && (
                <AppIcon name={{ ios: 'checkmark', android: 'check' }} size="s" color="onPrimary" />
              )}
            </View>
          </View>
        )}
      </View>
      {showTitle && (
        <View style={styles.caption}>
          <AppText role="body" scale="small" numberOfLines={1}>
            {media.title}
          </AppText>
          <View style={styles.meta}>
            {subtitle !== '' && (
              <AppText role="label" scale="medium" color="onSurfaceVariant">
                {subtitle}
              </AppText>
            )}
            {caption === undefined && media.rating !== null && <RatingBadge rating={media.rating} />}
          </View>
        </View>
      )}
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.s,
  },
  border: (selected: boolean) => ({
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.shape.m,
    borderWidth: selected ? theme.border.medium : theme.border.hairline,
    borderColor: selected ? theme.colors.primary : theme.colors.outline,
  }),
  check: {
    position: 'absolute',
    top: theme.spacing.xs,
    end: theme.spacing.xs,
  },
  checkCircle: (selected: boolean) => ({
    width: theme.iconSize.m + theme.spacing.xs,
    height: theme.iconSize.m + theme.spacing.xs,
    borderRadius: theme.shape.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.border.thin,
    borderColor: theme.colors.onScrim,
    backgroundColor: selected ? theme.colors.primary : theme.colors.scrim,
  }),
  caption: {
    marginTop: theme.spacing.s,
    gap: theme.spacing.xxs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
}));
