import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon, type IconName } from '@shared/core/presentation/components/AppIcon';

export type AppIconButtonProps = {
  readonly icon: IconName;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
};

/** A round button holding one symbol, the size of a regular button's height. */
export const AppIconButton = ({
  icon,
  accessibilityLabel,
  onPress,
  disabled = false,
}: AppIconButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => styles.button(pressed, disabled)}
  >
    <AppIcon name={icon} size="m" color="onSecondary" />
  </Pressable>
);

const styles = StyleSheet.create((theme) => ({
  button: (pressed: boolean, disabled: boolean) => ({
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.shape.full,
    backgroundColor: theme.colors.secondary,
    opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
  }),
}));
