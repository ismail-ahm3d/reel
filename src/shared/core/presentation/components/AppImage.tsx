import { Image } from 'expo-image';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { BaseShape } from '@shared/core/presentation/theme/contract';

/** Placement and size; the radius comes from the shape role and the placeholder from the theme. */
export type ImageLayoutStyle = Pick<
  ViewStyle,
  | 'margin'
  | 'marginTop'
  | 'marginBottom'
  | 'marginHorizontal'
  | 'alignSelf'
  | 'flex'
  | 'width'
  | 'height'
  | 'aspectRatio'
>;

export type AppImageProps = {
  /** null renders the placeholder surface: artwork is often missing on TMDB. */
  readonly uri: string | null;
  readonly shape?: keyof BaseShape;
  readonly fit?: 'cover' | 'contain';
  readonly accessibilityLabel?: string;
  /** Used by expo-image to cross-fade between images in the same slot (recycled cells). */
  readonly recyclingKey?: string;
  readonly style?: StyleProp<ImageLayoutStyle>;
  /** Fills the parent, behind siblings; for hero artwork. */
  readonly fill?: boolean;
  /** No placeholder surface behind the image: for logos and other artwork with transparency. */
  readonly transparent?: boolean;
};

export const AppImage = ({
  uri,
  shape = 'none',
  fit = 'cover',
  accessibilityLabel,
  recyclingKey,
  style,
  fill = false,
  transparent = false,
}: AppImageProps) => (
  <Image
    source={uri === null ? null : { uri }}
    contentFit={fit}
    transition={200}
    cachePolicy="memory-disk"
    {...(recyclingKey === undefined ? {} : { recyclingKey })}
    accessible={accessibilityLabel !== undefined}
    {...(accessibilityLabel === undefined ? {} : { accessibilityLabel })}
    style={[styles.image(shape, transparent), fill && StyleSheet.absoluteFill, style]}
  />
);

const styles = StyleSheet.create((theme) => ({
  image: (shape: keyof BaseShape, transparent: boolean) => ({
    borderRadius: theme.shape[shape],
    backgroundColor: transparent ? 'transparent' : theme.colors.surfaceVariant,
    overflow: 'hidden',
  }),
}));
