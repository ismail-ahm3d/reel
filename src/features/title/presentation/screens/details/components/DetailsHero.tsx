import { View, useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppScrim } from '@shared/core/presentation/components/AppScrim';
import { AppText } from '@shared/core/presentation/components/AppText';

export type HeroLogo = {
  readonly uri: string;
  readonly aspectRatio: number;
};

export type DetailsHeroProps = {
  readonly title: string;
  /** The title card: shown instead of the typed title when TMDB has one. */
  readonly logo: HeroLogo | null;
  readonly imageUri: string | null;
  readonly metaLine: string;
  readonly genreLine: string;
};

/** The logo's box: wide wordmarks are capped by width, tall marks by height. */
const logoSize = (logo: HeroLogo, screenWidth: number) => {
  const maxWidth = Math.min(screenWidth * 0.72, 420);
  const maxHeight = 120;
  const width = Math.min(maxWidth, maxHeight * logo.aspectRatio);
  return { width, height: width / logo.aspectRatio };
};

/** How far the artwork runs on past the caption while it melts into the page. */
export const heroBlend = 96;

/**
 * Edge-to-edge artwork under the transparent header, darkened behind the title card, then faded
 * into the page's background so the content below continues it without an edge.
 */
export const DetailsHero = ({ title, logo, imageUri, metaLine, genreLine }: DetailsHeroProps) => {
  const { width } = useWindowDimensions();
  const height = Math.min(width * 1.05, 620) + heroBlend;
  return (
    <View style={[styles.hero, { height }]}>
      <AppImage uri={imageUri} fill />
      <AppScrim blendBottom={heroBlend / height} />
      <View style={styles.caption}>
        {logo === null ? (
          <AppText
            role="display"
            scale="medium"
            color="onScrim"
            numberOfLines={3}
            style={{ textAlign: 'center' }}
            accessibilityRole="header"
          >
            {title}
          </AppText>
        ) : (
          <View accessible accessibilityRole="header" accessibilityLabel={title} style={styles.logo}>
            <AppImage uri={logo.uri} fit="contain" style={logoSize(logo, width)} transparent />
          </View>
        )}
        {metaLine !== '' && (
          <AppText role="label" scale="large" color="onScrim" style={{ textAlign: 'center' }}>
            {metaLine}
          </AppText>
        )}
        {genreLine !== '' && (
          <AppText role="label" scale="large" color="onScrim" style={{ textAlign: 'center' }}>
            {genreLine}
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  hero: {
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.scrim,
  },
  caption: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: heroBlend * 0.7,
    gap: theme.spacing.xs,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: theme.spacing.s,
  },
}));
