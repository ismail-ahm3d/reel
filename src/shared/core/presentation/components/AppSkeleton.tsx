import { useEffect, useState } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { BaseShape } from '@shared/core/presentation/theme/contract';

/** Size and placement of the placeholder: it stands in for something of that shape. */
export type SkeletonLayoutStyle = Pick<
  ViewStyle,
  'width' | 'height' | 'aspectRatio' | 'flex' | 'alignSelf' | 'marginTop' | 'marginBottom'
>;

export type AppSkeletonProps = {
  readonly shape?: keyof BaseShape;
  readonly style?: StyleProp<SkeletonLayoutStyle>;
};

/** A softly pulsing block where content is loading, so the page keeps its shape. */
export const AppSkeleton = ({ shape = 'm', style }: AppSkeletonProps) => {
  const [opacity] = useState(() => new Animated.Value(0.45));
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => {
      pulse.stop();
    };
  }, [opacity]);
  return (
    <Animated.View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.block(shape), { opacity }, style]}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  block: (shape: keyof BaseShape) => ({
    borderRadius: theme.shape[shape],
    backgroundColor: theme.colors.surfaceVariant,
  }),
}));
