import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type AppScrimProps = {
  /** toBackground fades artwork into the screen; toScrim darkens it for text on top. */
  readonly variant?: 'toBackground' | 'toScrim';
  /**
   * For toScrim: the share of the height, at the bottom, where the darkened artwork then melts
   * into the screen's background, so a hero has no edge where the page begins.
   */
  readonly blendBottom?: number;
};

/** A gradient laid over artwork from its top edge, transparent, down to its bottom edge. */
export const AppScrim = ({ variant = 'toScrim', blendBottom = 0 }: AppScrimProps) => {
  const { theme } = useUnistyles();
  if (variant === 'toBackground' || blendBottom <= 0) {
    const end = variant === 'toScrim' ? theme.colors.scrim : theme.colors.background;
    return (
      <LinearGradient
        colors={['transparent', 'transparent', end]}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    );
  }
  const blendStart = 1 - blendBottom;
  return (
    <>
      <LinearGradient
        colors={['transparent', 'transparent', theme.colors.scrim, theme.colors.scrim]}
        locations={[0, 0.3, blendStart, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {/* Eased: the background arrives slowly, then fully, so no band shows where it ends. */}
      <LinearGradient
        colors={[
          `${theme.colors.background}00`,
          `${theme.colors.background}40`,
          `${theme.colors.background}B3`,
          `${theme.colors.background}E6`,
          theme.colors.background,
        ]}
        locations={[
          blendStart,
          blendStart + blendBottom * 0.3,
          blendStart + blendBottom * 0.6,
          blendStart + blendBottom * 0.82,
          1,
        ]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </>
  );
};
