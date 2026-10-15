import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/** Positioning and sizing only; the pressed and disabled states are the wrapper's. */
export type PressableLayoutStyle = Pick<
  ViewStyle,
  | 'margin'
  | 'marginTop'
  | 'marginBottom'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'alignSelf'
  | 'flex'
  | 'width'
  | 'flexDirection'
  | 'alignItems'
  | 'gap'
>;

export type AppPressableProps = {
  readonly children: ReactNode;
  readonly onPress: () => void;
  readonly onLongPress?: () => void;
  readonly accessibilityLabel: string;
  readonly accessibilityHint?: string;
  readonly accessibilityRole?: 'button' | 'link' | 'tab';
  readonly selected?: boolean;
  readonly disabled?: boolean;
  /** dim fades like a list cell; scale shrinks a little, like a card being pressed in. */
  readonly feedback?: 'dim' | 'scale';
  readonly style?: StyleProp<PressableLayoutStyle>;
};

/** A pressable area for rows and cards: it dims while pressed, like a system cell. */
export const AppPressable = ({
  children,
  onPress,
  onLongPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  selected,
  disabled = false,
  feedback = 'dim',
  style,
}: AppPressableProps) => (
  <Pressable
    accessibilityRole={accessibilityRole}
    accessibilityLabel={accessibilityLabel}
    {...(accessibilityHint === undefined ? {} : { accessibilityHint })}
    accessibilityState={{ disabled, ...(selected === undefined ? {} : { selected }) }}
    disabled={disabled}
    onPress={onPress}
    {...(onLongPress === undefined ? {} : { onLongPress })}
    style={({ pressed }) => [styles.area(pressed, disabled, feedback), style]}
  >
    {children}
  </Pressable>
);

const styles = StyleSheet.create(() => ({
  area: (pressed: boolean, disabled: boolean, feedback: 'dim' | 'scale') => ({
    opacity: disabled ? 0.4 : pressed ? (feedback === 'dim' ? 0.6 : 0.9) : 1,
    transform: [{ scale: pressed && feedback === 'scale' ? 0.96 : 1 }],
  }),
}));
